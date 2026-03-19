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
const qs = require("qs");

const vnpay = new VNPay({
  tmnCode: "EU34Z09C",
  secureSecret: "IVR2SLANOTAPP62MHASM4RH7N739WH9D",
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
    vnp_Amount: Number(amount) * 100,
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
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => (sorted[k] = obj[k]));
  return sorted;
}

function verifyVnpSignature(rawParams, secret) {
  // KHÔNG mutate params gốc (vì bạn còn dùng nó ở ngoài)
  const params = { ...rawParams };

  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;

  const sorted = sortObject(params);

  // stringify giống demo VNPAY
  const signData = qs.stringify(sorted, { encode: false });

  const hash = crypto
    .createHmac("sha512", secret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");

  return hash === secureHash;
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
    process.env.VNP_HASH_SECRET || "IVR2SLANOTAPP62MHASM4RH7N739WH9D",
  );

  if (!isValid) {
    return { success: false, message: "Chữ ký không hợp lệ" };
  }

  const ok =
    params.vnp_ResponseCode === "00" && params.vnp_TransactionStatus === "00";

  if (ok) {
    return {
      success: true,
      message: "Thanh toán thành công",
      orderId: params.vnp_TxnRef,
      vnpTransactionNo: params.vnp_TransactionNo,
    };
  }

  return {
    success: false,
    message: `Thanh toán thất bại, mã lỗi: ${params.vnp_ResponseCode}`,
    status: params.vnp_TransactionStatus,
  };
}
module.exports = {
  buildPaymentUrl,
  checkPayment,
  getOrderDataFromSomewhere,
};
