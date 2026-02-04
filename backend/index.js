require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool } = require('./src/db/postgres'); // путь к твоему postgres.js
const authRoutes = require('./routes/auth'); // путь к твоим маршрутам auth.js
const orderRoutes = require("./routes/orders");


const app = express();
const port = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors({
  origin: 'http://localhost:5173', // фронтенд порт
  credentials: true,
}));
app.use(express.json()); // для парсинга JSON в body

// --- Routes ---
app.use('/api/auth', authRoutes);

app.use("/api/orders", orderRoutes);

// --- Тестовый root ---
app.get('/', (req, res) => {
  res.send('Welcome to Book Store Backend!');
});

// --- Проверка подключения к PostgreSQL ---
async function verifyDatabaseConnection(server) {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connection successful ✅');
  } catch (error) {
    console.error('PostgreSQL connection failed ❌', error);
    server.close(() => process.exit(1));
  }
}

// --- Запуск сервера ---
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

verifyDatabaseConnection(server);