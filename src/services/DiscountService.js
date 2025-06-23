// src/services/DiscountService.js
const Discount = require("../models/DiscountModel");

const createDiscount = (newDiscount) => {
  return new Promise(async (resolve, reject) => {
    const { code, type, value, desc, startDate, endDate, minValue } =
      newDiscount;
    try {
      const checkDiscount = await Discount.findOne({ code });
      if (checkDiscount) {
        return resolve({
          status: "ERR",
          message: "Discount code already exists",
        });
      }

      const discount = await Discount.create({
        code,
        type,
        value,
        desc,
        startDate,
        endDate,
        minValue,
      });

      resolve({
        status: "OK",
        message: "Discount created successfully",
        data: discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const checkDiscount = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      const discount = await Discount.findOne({ code, active: true });
      if (!discount) {
        return resolve({
          status: "ERR",
          message: "Discount code is invalid or expired",
        });
      }

      const currentDate = new Date();
      if (currentDate < discount.startDate || currentDate > discount.endDate) {
        return resolve({
          status: "ERR",
          message: "Discount code is no longer valid",
        });
      }

      resolve({
        status: "OK",
        message: "Discount code is valid",
        discount,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllDiscount = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const discounts = await Discount.find();
      resolve({
        status: "OK",
        message: "Fetched all discounts successfully",
        data: discounts,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const updateDiscount = (id, updateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updated = await Discount.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updated) {
        return resolve({
          status: "ERR",
          message: "Discount not found",
        });
      }

      resolve({
        status: "OK",
        message: "Discount updated successfully",
        data: updated,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteDiscount = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleted = await Discount.findByIdAndDelete(id);

      if (!deleted) {
        return resolve({
          status: "ERR",
          message: "Discount not found",
        });
      }

      resolve({
        status: "OK",
        message: "Discount deleted successfully",
        data: deleted,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createDiscount,
  checkDiscount,
  getAllDiscount,
  updateDiscount,
  deleteDiscount,
};
