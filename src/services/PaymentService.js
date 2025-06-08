// src/services/PaymentService.js
const Order = require("../models/OrderModel");
const mongoose = require("mongoose"); // Đảm bảo đường dẫn đúng
const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
const crypto = require("crypto");

const vnpay = new VNPay({
  tmnCode: "EU34Z09C",
  secureSecret: "YEFITI6TNUNB00IP6VHL0P2NC4YGEKNI",
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
  loggerFn: ignoreLogger,
});

async function buildPaymentUrl({
  amount,
  ipAddr,
  txnRef,
  orderInfo,
  orderType,
  returnUrl,
}) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType || ProductCode.Other,
    vnp_ReturnUrl: returnUrl,
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow),
  });
}

function verifyVnpSignature(params, secret) {
  const vnp_SecureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sortedKeys = Object.keys(params).sort();
  const signData = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");

  const hash = crypto
    .createHmac("sha512", secret)
    .update(signData, "utf-8")
    .digest("hex");

  return hash === vnp_SecureHash;
}

async function getOrderDataFromSomewhere(orderId) {
  // orderId thực chất là _id MongoDB dưới dạng string
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return null;
  }
  return await Order.findById(orderId);
}

// Hàm checkPayment dùng verifyVnpSignature
async function checkPayment(params) {
  const isValid = verifyVnpSignature(
    params,
    "YEFITI6TNUNB00IP6VHL0P2NC4YGEKNI"
  );

  if (!isValid) {
    return { success: false, message: "Chữ ký không hợp lệ" };
  }

  if (params.vnp_ResponseCode === "00") {
    return {
      success: true,
      message: "Thanh toán thành công",
      orderId: params.vnp_TxnRef,
    };
  } else {
    return {
      success: false,
      message: `Thanh toán thất bại, mã lỗi: ${params.vnp_ResponseCode}`,
    };
  }
}

module.exports = {
  buildPaymentUrl,
  checkPayment,
  getOrderDataFromSomewhere,
};
