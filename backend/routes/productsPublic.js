// routes/productsPublic.js
const express = require("express");
const {
  listProducts,
  getProduct,
} = require("../controllers/dashboardProductsController");

const router = express.Router();

// ПУБЛИЧНО: доступно всем
router.get("/", listProducts);
router.get("/:id", getProduct);

module.exports = router;