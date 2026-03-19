const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const UserOtp = require("../models/UserOtpModel");
const { sendEmailOtpRegister } = require("./EmailService");
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone, isAdmin } = newUser;
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
        isAdmin,
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
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const requestSignUpOtp = (newUser) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, email, password, confirmPassword, phone } = newUser;

      const checkUser = await User.findOne({ email });
      if (checkUser) {
        return resolve({ status: "ERR", message: "Email đã tồn tại" });
      }

      const checkPhone = await User.findOne({ phone });
      if (checkPhone) {
        return resolve({ status: "ERR", message: "Phone đã tồn tại" });
      }

      if (password !== confirmPassword) {
        return resolve({ status: "ERR", message: "Mật khẩu không khớp" });
      }

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

      await UserOtp.findOneAndUpdate(
        { email },
        {
          name,
          email,
          phone,
          password,
          otp,
          expiresAt,
        },
        { upsert: true, new: true },
      );

      await sendEmailOtpRegister(email, otp);

      return resolve({
        status: "OK",
        message: "Đã gửi OTP về email",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const verifySignUpOtp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { email, otp } = data;

      const otpRecord = await UserOtp.findOne({ email });
      if (!otpRecord) {
        return resolve({
          status: "ERR",
          message: "OTP không tồn tại hoặc đã hết hạn",
        });
      }

      if (otpRecord.expiresAt < new Date()) {
        await UserOtp.deleteOne({ email });
        return resolve({
          status: "ERR",
          message: "OTP đã hết hạn",
        });
      }

      if (otpRecord.otp !== otp) {
        return resolve({
          status: "ERR",
          message: "OTP không đúng",
        });
      }

      const checkUser = await User.findOne({ email });
      if (checkUser) {
        await UserOtp.deleteOne({ email });
        return resolve({
          status: "ERR",
          message: "Email đã tồn tại",
        });
      }

      const checkPhone = await User.findOne({ phone: otpRecord.phone });
      if (checkPhone) {
        await UserOtp.deleteOne({ email });
        return resolve({
          status: "ERR",
          message: "Phone đã tồn tại",
        });
      }

      const hash = bcrypt.hashSync(otpRecord.password, 10);

      const createUser = await User.create({
        name: otpRecord.name,
        email: otpRecord.email,
        password: hash,
        phone: otpRecord.phone,
        isAdmin: false,
      });

      await UserOtp.deleteOne({ email });

      return resolve({
        status: "OK",
        message: "Đăng ký thành công",
        data: createUser,
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
  requestSignUpOtp,
  verifySignUpOtp,
};
