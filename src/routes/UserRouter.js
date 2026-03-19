const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authAdminMiddleware,
  authUserMiddleware,
} = require("../middleware/authMiddleware");

router.post("/sign-up", userController.createUser);
router.post("/sign-in", userController.loginUser);
router.post("/log-out", userController.logoutUser);
router.put("/update-user/:id", userController.updateUser);
router.delete(
  "/delete-user/:id",

  userController.deleteUser,
);
router.get("/get-all", userController.getAllUser);
router.get("/get-details/:id", userController.getDetailsUser);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many/", userController.deleteMany);
router.post("/sign-up/request-otp", userController.requestSignUpOtp);
router.post("/sign-up/verify-otp", userController.verifySignUpOtp);
module.exports = router;
