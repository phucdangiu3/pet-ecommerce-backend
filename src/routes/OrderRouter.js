const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authUserMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", authUserMiddleWare, OrderController.createOrder);
router.get("/get-all-order/:id", OrderController.getAllOrderDetails);
router.get("/get-details-order/:id", OrderController.getDetailsOrder);
router.delete("/cancel-order/:id", OrderController.CancelOrderDetails);
router.get("/get-all-order", OrderController.getAllOrder);

module.exports = router;
