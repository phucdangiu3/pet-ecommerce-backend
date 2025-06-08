// src/controllers/PaymentController.js
const PaymentService = require("../services/PaymentService");
const Order = require("../models/OrderModel");
const ProductCode = require("vnpay").ProductCode;

const createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const ipAddr = req.ip === "::1" ? "127.0.0.1" : req.ip;
    const returnUrl = "http://localhost:3000/payment-result";

    const paymentUrl = await PaymentService.buildPaymentUrl({
      amount,
      ipAddr,
      txnRef: orderId,
      orderInfo: orderId,
      orderType: ProductCode.Other,
      returnUrl,
    });

    res.status(201).json({ paymentUrl });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment URL", error: error.message });
  }
};

const checkPayment = async (req, res) => {
  try {
    const params = { ...req.query, ...req.body };
    console.log("Check Payment Params:", params);

    const result = await PaymentService.checkPayment(params);
    console.log("Payment check result:", result);

    if (result.success) {
      const orderData = await PaymentService.getOrderDataFromSomewhere(
        result.orderId
      );
      console.log("Order data from DB:", orderData);

      if (orderData) {
        orderData.isPaid = true;
        orderData.paidAt = new Date();
        await orderData.save();

        res.status(200).json({
          message: result.message,
          orderId: result.orderId,
          success: true,
          savedOrder: orderData,
        });
      } else {
        res
          .status(400)
          .json({ message: "Không tìm thấy dữ liệu đơn hàng", success: false });
      }
    } else {
      res.status(400).json({ message: result.message, success: false });
    }
  } catch (error) {
    console.error("Lỗi kiểm tra thanh toán:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// src/controllers/OrderController.js (hoặc PaymentController.js tùy bạn đặt)
const markPaymentPaid = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ status: "ERR", message: "Thiếu orderId" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: "ERR", message: "Không tìm thấy đơn hàng" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();

    res
      .status(200)
      .json({ status: "OK", message: "Cập nhật thanh toán thành công", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "ERR", message: "Lỗi server" });
  }
};

module.exports = {
  createPayment,
  checkPayment,
  markPaymentPaid,
};
