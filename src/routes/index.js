const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const PostRouter = require("./PostRouter");
const CommentRouter = require("./CommentRouter");
const chatRouter = require("./ChatRouter");

const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/post", PostRouter);
  app.use("/api/comments", CommentRouter);
  app.use("/api/chat", chatRouter);
};
module.exports = routes;
