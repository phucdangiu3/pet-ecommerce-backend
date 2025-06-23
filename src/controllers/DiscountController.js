// src/controllers/DiscountController.js
const DiscountService = require("../services/DiscountService");

const createDiscount = async (req, res) => {
  try {
    const { code, type, value, desc, startDate, endDate, minValue } = req.body;

    if (
      !code ||
      !type ||
      !value ||
      !desc ||
      !startDate ||
      !endDate ||
      !minValue
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const response = await DiscountService.createDiscount(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || e,
    });
  }
};

const checkDiscount = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(200).json({
        status: "ERR",
        message: "The code is required",
      });
    }

    const response = await DiscountService.checkDiscount(code);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message || e,
    });
  }
};
const getAllDiscount = async (req, res) => {
  try {
    const response = await DiscountService.getAllDiscount();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message || e });
  }
};
const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const response = await DiscountService.updateDiscount(id, updateData);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({ message: e.message || e });
  }
};

const deleteDiscount = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await DiscountService.deleteDiscount(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({ message: e.message || e });
  }
};

module.exports = {
  createDiscount,
  checkDiscount,
  getAllDiscount,
  updateDiscount,
  deleteDiscount,
};
