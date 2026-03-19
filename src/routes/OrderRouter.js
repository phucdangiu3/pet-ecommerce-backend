const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", OrderController.createOrder);
router.get("/get-all-order/:id", OrderController.getAllOrderDetails);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete("/cancel-order/:id", OrderController.CancelOrderDetails);
router.put("/update-order/:id", OrderController.updateOrder);
router.get("/get-all-order", OrderController.getAllOrder); // Route lấy tất cả đơn hàng của một người dùng cụ thể
router.get(
  "/get-all-order/:userId",

  OrderController.getAllOrderDetails,
);

module.exports = router;
