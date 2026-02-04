const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../src/db/postgres");

// Генерация JWT с ролью
const generateJwt = (id, email, role_id) => {
  // role_id: 1 = admin, 2 = user
  const role = role_id === 1 ? "ADMIN" : "USER";
  return jwt.sign(
    { id, email, role },  // передаём role как строку
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const register = async (req, res) => {
  const { email, password, role_id } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const existing = await pool.query('SELECT * FROM "Login" WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO "Login"(email,password,role_id) VALUES($1,$2,$3) RETURNING id, email, role_id',
      [email, hashed, role_id || 2]
    );

    const user = result.rows[0];
    const token = generateJwt(user.id, user.email, user.role_id);

    res.status(201).json({ token, role: user.role_id === 1 ? "ADMIN" : "USER" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const userRes = await pool.query('SELECT * FROM "Login" WHERE email=$1', [email]);
    if (!userRes.rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateJwt(user.id, user.email, user.role_id);

    res.json({ token, role: user.role_id === 1 ? "ADMIN" : "USER" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };