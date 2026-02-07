const express = require("express");
const { getUserOrders, createOrder, getAllOrders, deleteOrder } = require("../controllers/orderController");
const authenticate = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const router = express.Router();


// GET /api/orders — получить заказы текущего пользователя
router.get("/", authenticate, getUserOrders);

// POST /api/orders — создать новый заказ
router.post("/", authenticate, createOrder);

// GET /api/orders/admin — все заказы (admin)
router.get("/admin", authenticate, adminOnly, getAllOrders);
// DELETE /api/orders/:id — удалить/отменить заказ
router.delete("/:id", authenticate, deleteOrder);

module.exports = router;