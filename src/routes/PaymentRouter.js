const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/PaymentController");

router.post("/create-qr", PaymentController.createPayment);
router.get("/check-payment-vnpay", PaymentController.checkPayment);
router.post("/mark-paid", PaymentController.markPaymentPaid);
module.exports = router;
