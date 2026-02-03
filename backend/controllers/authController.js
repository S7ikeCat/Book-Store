const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../src/db/postgres");

const generateJwt = (id, email) => {
  return jwt.sign(
    { id, email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const existing = await pool.query(
      'SELECT * FROM "Login" WHERE email=$1',
      [email]
    );

    if (existing.rows.length)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO "Login"(email,password) VALUES($1,$2) RETURNING id, email',
      [email, hashed]
    );

    const user = result.rows[0];
    const token = generateJwt(user.id, user.email);

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const userRes = await pool.query(
      'SELECT * FROM "Login" WHERE email=$1',
      [email]
    );

    if (!userRes.rows.length)
      return res.status(400).json({ message: "Invalid credentials" });

    const user = userRes.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateJwt(user.id, user.email);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };
