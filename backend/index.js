require('dotenv').config();
const express = require('express');
const { pool } = require('./src/db/postgres');

const authRoutes = require('./routes/auth');
const orderRoutes = require("./routes/orders");
const userRoutes = require("./routes/users");

const path = require("path");
const dashboardUploadRoutes = require("./routes/dashboardUploads");
const dashboardProductsRoutes = require("./routes/dashboardProducts");

const app = express();
const port = process.env.PORT || 3000;

/* =====================================================
   🔥 HARD CORS FIX (без cors(), без app.options("*"))
   ===================================================== */
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin === "http://localhost:5173") {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  // ✅ отвечаем на preflight ЗДЕСЬ
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* =====================================================
   Middlewares
   ===================================================== */
app.use(express.json());

/* =====================================================
   Static uploads
   ===================================================== */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
   Routes
   ===================================================== */
app.use('/api/auth', authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use("/api/dashboard/uploads", dashboardUploadRoutes);
app.use("/api/dashboard/products", dashboardProductsRoutes);

/* =====================================================
   Root
   ===================================================== */
app.get('/', (req, res) => {
  res.send('Welcome to Book Store Backend!');
});

/* =====================================================
   PostgreSQL check
   ===================================================== */
async function verifyDatabaseConnection(server) {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL connection successful ✅');
  } catch (error) {
    console.error('PostgreSQL connection failed ❌', error);
    server.close(() => process.exit(1));
  }
}

/* =====================================================
   Start server
   ===================================================== */
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

verifyDatabaseConnection(server);