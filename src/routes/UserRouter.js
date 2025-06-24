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
router.put("/update-user/:id", authUserMiddleware, userController.updateUser);
router.delete("/delete-user/:id",authAdminMiddleware, userController.deleteUser);
router.get("/get-all",authAdminMiddleware, userController.getAllUser);
router.get(
  "/get-details/:id",
  authUserMiddleware,
  userController.getDetailsUser
);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete-many/",authAdminMiddleware, userController.deleteMany);

module.exports = router;
