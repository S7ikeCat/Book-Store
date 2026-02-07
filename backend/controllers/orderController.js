const { pool } = require("../src/db/postgres");

// Получение заказов пользователя
const getUserOrders = async (req, res) => {
  const email = req.user.email; // берём из JWT
  try {
    const result = await pool.query(
      'SELECT id, items, total_price, shipping_info, created_at FROM "Orders" WHERE user_email = $1 ORDER BY created_at DESC',
      [email]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// Все заказы (только admin)
const getAllOrders = async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_email, items, total_price, shipping_info, created_at FROM "Orders" ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};

// Удаление/отмена заказа (delete)
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM "Orders" WHERE id = $1', [id]);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};


// Создание нового заказа
const createOrder = async (req, res) => {
  const email = req.user.email; // берём из JWT
  const { items, totalPrice, shippingInfo } = req.body;

  if (!items || !totalPrice || !shippingInfo) {
    return res.status(400).json({ message: "Missing order data" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Orders"(user_email, items, total_price, shipping_info) 
       VALUES($1, $2, $3, $4) RETURNING *`,
      [email, JSON.stringify(items), totalPrice, JSON.stringify(shippingInfo)]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }

  
};

module.exports = { getUserOrders, createOrder, getAllOrders, deleteOrder };