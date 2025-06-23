const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = async (orderData) => {
  try {
    const newOrder = new Order({
      user: orderData.user,
      orderItems: orderData.orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      itemsPrice: orderData.itemsPrice,
      shippingPrice: orderData.shippingPrice,
      totalPrice: orderData.totalPrice,
      discountCode: orderData.discountCode,
      isPaid: false,
      isDelivered: false,
    });

    await newOrder.save();
    await EmailService.sendEmailCreateOrder(
      orderData.email,
      orderData.orderItems,
      newOrder._id.toString(),
      orderData.totalPrice,
      orderData.note || ""
    );

    for (const item of orderData.orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.product,
          countInStock: { $gte: item.amount }, // kiểm tra còn đủ hàng
        },
        {
          $inc: {
            countInStock: -item.amount,
            selled: item.amount,
          },
        },
        { new: true }
      );

      if (!updatedProduct) {
        throw new Error(`Sản phẩm ${item.name} không đủ hàng tồn kho`);
      }
    }

    return {
      status: "OK",
      message: "Đặt hàng thành công",
      orderId: newOrder._id.toString(),
    };
  } catch (error) {
    console.error("Error in OrderService.createOrder:", error);
    throw new Error("Lỗi khi tạo đơn hàng");
  }
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({ _id: id });

      if (order === null) {
        resolve({
          status: "OK",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const CancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Duyệt từng sản phẩm để cập nhật tồn kho và số lượng bán
      // for (const item of data) {
      //   const productData = await Product.findOneAndUpdate(
      //     {
      //       _id: item.product,
      //       selled: { $gte: item.amount },
      //     },
      //     {
      //       $inc: {
      //         countInStock: +item.amount,
      //         selled: -item.amount,
      //       },
      //     },
      //     { new: true }
      //   );

      //   if (!productData) {
      //     return resolve({
      //       status: "ERR",
      //       message: `San pham voi id: ${item.product} khong ton tai hoac so luong ban khong du`,
      //     });
      //   }
      // }

      // Nếu tất cả sản phẩm đều cập nhật thành công, xóa đơn hàng
      const order = await Order.findByIdAndDelete(id);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "The order is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById(id);
      if (!order) {
        return resolve({
          status: "ERR",
          message: "Không tìm thấy đơn hàng để cập nhật",
        });
      }

      // Cập nhật các trường cho phép
      const updatableFields = ["isDelivered", "isPaid"];
      updatableFields.forEach((field) => {
        if (data[field] !== undefined) {
          order[field] = data[field];
        }
      });

      const updatedOrder = await order.save();

      resolve({
        status: "OK",
        message: "Cập nhật đơn hàng thành công",
        data: updatedOrder,
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả đơn hàng
      const allOrder = await Order.find().sort({
        createdAt: -1,
        updatedAt: -1,
      });
      resolve({
        status: "OK",
        message: "Success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllOrderDetails = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Lấy tất cả đơn hàng của một người dùng cụ thể
      const order = await Order.find({ user: userId }).sort({
        createdAt: -1,
        updatedAt: -1,
      });

      if (order.length === 0) {
        return resolve({
          status: "OK",
          message: "No orders found for this user",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  updateOrder,
  CancelOrderDetails,
  getAllOrder,
};
