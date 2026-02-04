const express = require("express");
const { getUserOrders } = require("../controllers/orderController");
const authenticate = require("../miffleware/auth");
const router = express.Router();

// GET /api/orders — получить заказы текущего пользователя
router.get("/", authenticate, getUserOrders);

module.exports = router;
