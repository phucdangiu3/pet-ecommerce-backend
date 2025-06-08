const OrderService = require("../services/OrderService");
const createOrder = async (req, res) => {
  try {
    const {
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

    // Pass shippingAddress whole object to OrderService
    const result = await OrderService.createOrder({
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
  getAllOrder,
};
