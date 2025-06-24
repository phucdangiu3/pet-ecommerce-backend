const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create-qr", authUserMiddleware, PaymentController.createPayment);
router.get(
  "/check-payment-vnpay",
  authUserMiddleware,
  PaymentController.checkPayment
);
router.post(
  "/mark-paid",
  authUserMiddleware,
  PaymentController.markPaymentPaid
);
module.exports = router;
