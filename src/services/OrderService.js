const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
// const EmailService = require("../services/EmailService");

const createOrder = async (orderData) => {
  try {
    const newOrder = new Order({
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

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({ user: id });

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

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
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
module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  CancelOrderDetails,
  getAllOrder,
};
