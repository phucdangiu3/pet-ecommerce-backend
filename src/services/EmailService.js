const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");

const createTransporter = () => {
  if (!process.env.MAIL_ACCOUNT || !process.env.MAIL_PASSWORD) {
    throw new Error("Thiếu MAIL_ACCOUNT hoặc MAIL_PASSWORD trong file .env");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_ACCOUNT,
      pass: process.env.MAIL_PASSWORD,
    },
  });
};

const sendEmailCreateOrder = async (
  email,
  orderItems,
  orderId,
  totalPrice,
  note,
) => {
  console.log("EMAIL:", process.env.MAIL_ACCOUNT);
  console.log("PASSWORD:", process.env.MAIL_PASSWORD);
  console.log("📧 Gửi đến email:", email);

  try {
    const transporter = createTransporter();
    transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));

    let listItem = "";
    let attachImage = [];

    orderItems.forEach((order) => {
      listItem += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${order.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${order.amount}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${order.price.toLocaleString()} VND</td>
          <td style="padding: 8px; border: 1px solid #ddd;">
            <img src="${order.image}" width="80" alt="image"/>
          </td>
        </tr>
      `;
      attachImage.push({ path: order.image });
    });

    const now = new Date().toLocaleString("vi-VN");

    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <h2 style="color: #2a9fd6;">✅ Xác nhận đơn hàng thành công từ Shiinny</h2>
        <p>Cảm ơn bạn đã đặt hàng tại Shiinny Shop! Dưới đây là thông tin đơn hàng của bạn:</p>

        <p><strong>🧾 Mã đơn hàng:</strong> ${orderId}</p>
        <p><strong>📅 Ngày đặt hàng:</strong> ${now}</p>
        <p><strong>💰 Tổng tiền:</strong> ${totalPrice.toLocaleString()} VND</p>
        ${note ? `<p><strong>📝 Ghi chú:</strong> ${note}</p>` : ""}

        <h3 style="margin-top: 24px;">Chi tiết sản phẩm</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead style="background-color: #f2f2f2;">
            <tr>
              <th style="padding: 10px; border: 1px solid #ddd;">Sản phẩm</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Số lượng</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Giá</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Hình ảnh</th>
            </tr>
          </thead>
          <tbody>
            ${listItem}
          </tbody>
        </table>

        <p style="margin-top: 30px;">Shop sẽ xử lý đơn hàng sớm nhất. Cảm ơn bạn!</p>

        <hr style="margin: 40px 0;" />
        <p style="font-size: 12px; color: #999;">Đây là email tự động. Vui lòng không trả lời lại email này.</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Shiinny Shop" <${process.env.MAIL_ACCOUNT}>`,
      to: email,
      subject: "Bạn đã đặt hàng tại shop Shiinny",
      text: "Đơn hàng của bạn đã được ghi nhận",
      html,
      attachments: attachImage,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

const sendEmailOtpRegister = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>🔐 Xác thực đăng ký tài khoản</h2>
        <p>Mã OTP của bạn là:</p>
        <h1 style="letter-spacing: 6px; color: #2a9fd6;">${otp}</h1>
        <p>Mã có hiệu lực trong 5 phút.</p>
        <p>Nếu bạn không thực hiện đăng ký, hãy bỏ qua email này.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Shiinny Shop" <${process.env.MAIL_ACCOUNT}>`,
      to: email,
      subject: "Mã OTP đăng ký tài khoản",
      text: `Mã OTP của bạn là ${otp}. Mã có hiệu lực trong 5 phút.`,
      html,
    });
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw error;
  }
};

module.exports = {
  sendEmailCreateOrder,
  sendEmailOtpRegister,
};
