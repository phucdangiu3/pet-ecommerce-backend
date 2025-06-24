// src/routes/DiscountRouter.js
const express = require("express");
const router = express.Router();
const DiscountController = require("../controllers/DiscountController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");
// Tạo mã giảm giá
router.post("/create", authAdminMiddleware, DiscountController.createDiscount);

// Kiểm tra mã giảm giá
router.post("/check", DiscountController.checkDiscount);
router.get("/get-all", DiscountController.getAllDiscount);
router.put(
  "/update/:id",
  authAdminMiddleware,
  DiscountController.updateDiscount
); // ✅ update
router.delete(
  "/delete/:id",
  authAdminMiddleware,
  DiscountController.deleteDiscount
); // ✅ delete

module.exports = router;
