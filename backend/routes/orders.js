const express = require("express");
const { createOrder, getUserOrders } = require("../controllers/orderController");
const router = express.Router();

// POST /api/orders
router.post("/", createOrder);

// GET /api/orders/:email
router.get("/:email", getUserOrders);

module.exports = router;
