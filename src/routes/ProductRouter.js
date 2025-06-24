const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", authAdminMiddleware, ProductController.createProduct);
router.put("/update/:id", authAdminMiddleware, ProductController.updateProduct);
router.get("/get-details/:id", ProductController.getDetailsProduct);
router.delete(
  "/delete/:id",
  authAdminMiddleware,
  ProductController.deleteProduct
);
router.get("/get-all", ProductController.getAllProduct);
router.delete(
  "/delete-many/",
  authAdminMiddleware,
  ProductController.deleteMany
);
router.get("/get-all-type", ProductController.getAllType);
module.exports = router;
