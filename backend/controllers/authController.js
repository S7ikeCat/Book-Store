const bcrypt = require("bcrypt"); // библиотека для хэширования паролей
const jwt = require("jsonwebtoken"); // библиотека для создания и проверки JWT
const { pool } = require("../src/db/postgres"); // подключение к PostgreSQL через pool

// Функция для генерации JWT с ролью пользователя
const generateJwt = (id, email, role_id) => {
  // role_id: 1 = admin, 2 = user
  const role = role_id === 1 ? "ADMIN" : "USER"; // конвертируем role_id в строковое значение
  return jwt.sign(
    { id, email, role },  // payload токена содержит id, email и роль
    process.env.JWT_SECRET, // секрет для подписи токена
    { expiresIn: "1d" } // токен действует 1 день
  );
};

// Регистрация нового пользователя
const register = async (req, res) => {
  const { email, password, role_id } = req.body;

  // Проверка, что email и пароль переданы
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    // Проверяем, есть ли уже пользователь с таким email
    const existing = await pool.query('SELECT * FROM "Login" WHERE email=$1', [email]);
    if (existing.rows.length) return res.status(400).json({ message: "Email already exists" });

    // Хэшируем пароль
    const hashed = await bcrypt.hash(password, 10);

    // Добавляем пользователя в базу
    const result = await pool.query(
      'INSERT INTO "Login"(email,password,role_id) VALUES($1,$2,$3) RETURNING id, email, role_id',
      [email, hashed, role_id || 2] // по умолчанию role_id = 2 (USER)
    );

    const user = result.rows[0];

    // Генерируем JWT для нового пользователя
    const token = generateJwt(user.id, user.email, user.role_id);

    // Отправляем токен и роль клиента на фронт
    res.status(201).json({ token, role: user.role_id === 1 ? "ADMIN" : "USER" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Вход пользователя (логин)
const login = async (req, res) => {
  const { email, password } = req.body;

  // Проверка, что email и пароль переданы
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    // Находим пользователя по email
    const userRes = await pool.query('SELECT * FROM "Login" WHERE email=$1', [email]);
    if (!userRes.rows.length) return res.status(400).json({ message: "Invalid credentials" });

    const user = userRes.rows[0];

    // Сравниваем введённый пароль с хэшем в базе
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Генерируем JWT для пользователя
    const token = generateJwt(user.id, user.email, user.role_id);

    // Отправляем токен и роль клиента на фронт
    res.json({ token, role: user.role_id === 1 ? "ADMIN" : "USER" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Экспортируем функции, чтобы использовать их в роутере
module.exports = { register, login };