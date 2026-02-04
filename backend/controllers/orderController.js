const { pool } = require("../src/db/postgres");

// Создание заказа
const createOrder = async (req, res) => {
  const { userEmail, items, totalPrice, shippingInfo } = req.body;

  if (!userEmail || !items || !totalPrice || !shippingInfo) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Проверяем, что пользователь существует
    const userRes = await pool.query('SELECT * FROM "Login" WHERE email=$1', [userEmail]);
    if (!userRes.rows.length) return res.status(400).json({ message: "User not found" });

    // Сохраняем заказ
    const result = await pool.query(
      `INSERT INTO "Orders"(user_email, items, total_price, shipping_info)
       VALUES($1, $2, $3, $4) RETURNING *`,
      [userEmail, JSON.stringify(items), totalPrice, JSON.stringify(shippingInfo)]
    );

    res.status(201).json({ order: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Получение всех заказов пользователя
const getUserOrders = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await pool.query('SELECT * FROM "Orders" WHERE user_email=$1 ORDER BY created_at DESC', [email]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createOrder, getUserOrders };
