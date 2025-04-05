const {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controller/productController");
const express = require("express");
const router = express.Router();

router.post("/create", createProduct);
router.get("/getAllProducts", getAllProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
