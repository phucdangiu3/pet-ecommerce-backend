// src/models/DiscountModel.js
const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Mã giảm giá
  type: { type: String, required: true }, // Loại giảm giá (phần trăm hoặc số tiền)
  value: { type: Number, required: true }, // Giá trị giảm giá
  desc: { type: String }, // ✅ thêm mô tả
  startDate: { type: Date, required: true }, // Ngày bắt đầu
  endDate: { type: Date, required: true }, // Ngày hết hạn
  active: { type: Boolean, default: true }, // Trạng thái mã giảm giá (hoạt động hay không)
  minValue: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu để áp dụng mã giảm giá
  createdAt: { type: Date, default: Date.now }, // Ngày tạo
});

const Discount = mongoose.model("Discount", discountSchema);

module.exports = Discount;
