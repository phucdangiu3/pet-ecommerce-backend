const mongoose = require("mongoose");

const userOtpSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    phone: { type: String, required: true },
    password: { type: String, required: true }, // tạm thời
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      expires: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserOtp", userOtpSchema);
