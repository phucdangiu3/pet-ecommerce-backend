const OrderService = require("../services/OrderService");
const { sendEmailCreateOrder } = require("../services/EmailService");
const createOrder = async (req, res) => {
  try {
    const {
      email,
      note,
      shippingAddress,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      discountCode,
    } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone ||
      !orderItems ||
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu dữ liệu bắt buộc",
      });
    }
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        status: "ERR",
        message: "Không tìm thấy thông tin người dùng từ token",
      });
    }

    // Pass shippingAddress whole object to OrderService
    const result = await OrderService.createOrder({
      user: userId, // ✅ thêm dòng này
      email, // ✅ thêm dòng này
      note,
      shippingAddress,
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      discountCode,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server",
    });
  }
};
const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("userId", userId);

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getAllOrderDetails(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The userId is required",
      });
    }
    const response = await OrderService.getDetailsOrder(orderId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "Thiếu ID đơn hàng",
      });
    }

    const result = await OrderService.updateOrder(orderId, data);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi server khi cập nhật đơn hàng",
    });
  }
};

const CancelOrderDetails = async (req, res) => {
  try {
    const data = req.body.orderItems;
    const orderId = req.params.id;
    if (!orderId) {
      return res.status(200).json({
        status: "ERR",
        message: "The orderId is required",
      });
    }
    const response = await OrderService.CancelOrderDetails(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllOrder = async (req, res) => {
  try {
    // Admin lấy tất cả các đơn hàng
    const data = await OrderService.getAllOrder();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  CancelOrderDetails,
  updateOrder,
  getAllOrder,
  getAllOrderDetails,
};
