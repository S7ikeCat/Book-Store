// routes/dashboardProducts.js
const express = require("express");
const authenticate = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/dashboardProductsController");

const router = express.Router();

// все dashboard-операции только для ADMIN
router.use(authenticate, adminOnly);

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;