const express = require("express");
const { getUserOrders, createOrder } = require("../controllers/orderController");
const authenticate = require("../middleware/auth");
const router = express.Router();

// GET /api/orders — получить заказы текущего пользователя
router.get("/", authenticate, getUserOrders);

// POST /api/orders — создать новый заказ
router.post("/", authenticate, createOrder);

module.exports = router;