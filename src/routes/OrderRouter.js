const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/create", authUserMiddleware, OrderController.createOrder);
router.get(
  "/get-all-order/:id",
  authUserMiddleware,
  OrderController.getAllOrderDetails
);
router.get(
  "/get-details-order/:id",
  authUserMiddleware,
  OrderController.getDetailsOrder
);
router.delete(
  "/cancel-order/:id",
  authAdminMiddleware,
  OrderController.CancelOrderDetails
);
router.put(
  "/update-order/:id",
  authAdminMiddleware,
  OrderController.updateOrder
);
router.get("/get-all-order", authUserMiddleware, OrderController.getAllOrder); // Route lấy tất cả đơn hàng của một người dùng cụ thể
router.get(
  "/get-all-order/:userId",
  authAdminMiddleware,
  OrderController.getAllOrderDetails
);

module.exports = router;
