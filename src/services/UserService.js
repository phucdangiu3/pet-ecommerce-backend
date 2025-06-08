const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        return resolve({ status: "ERR", message: "Email đã tồn tại" });
      }
      const checkPhone = await User.findOne({
        phone: phone,
      });
      if (checkPhone !== null) {
        return resolve({ status: "ERR", message: "Phone đã tồn tại" });
      }
      const hash = bcrypt.hashSync(password, 10);

      const createUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createUser) {
        return resolve({
          status: "OK",
          message: "SUCCESS",
          data: createUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "Email không đúng",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        return resolve({
          status: "ERR",
          message: "The password of user is incorrect",
        });
      }
      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      console.log("access_token", access_token);
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      return resolve({
        status: "OK",
        message: "SUCCESS",
        access_token,
        refresh_token,
      });
      //
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (!checkUser) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
      //
    } catch (e) {
      reject(e);
    }
  });
};
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user is not defined",
        });
      }
      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 });
      resolve({
        status: "OK",
        message: "Success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
};
