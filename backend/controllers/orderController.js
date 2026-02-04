const { pool } = require("../src/db/postgres");

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

module.exports = { getUserOrders };
