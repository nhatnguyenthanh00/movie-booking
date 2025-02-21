const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendMail");
let otpStore = {};

const sendOtp = async (req, res) => {
  const { type, email } = req.body;
  try {
    if (!/[\w.-]+@[\w.-]+\.\w+/.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ!" });
    }

    if (!["register", "reset-password"].includes(type)) {
      return res.status(400).json({ message: "Loại OTP không hợp lệ!" });
    }
    if (type === "register") {
      const userExists = await User.findOne({ email });
      if (userExists)
        return res.status(400).json({ message: "Email đã tồn tại!" });
    } else if (type === "reset-password") {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Email không tồn tại!" });
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP hết hạn sau 5 phút
    if (!otpStore[email]) otpStore[email] = {};
    otpStore[email][type] = { otp, isVerified: false, expiresAt }; // Lưu OTP kèm thời gian hết hạn
    await sendEmail(email, otp, type);

    res
      .status(200)
      .json({
        message: `OTP đã được gửi để ${
          type === "register" ? "đăng ký" : "đặt lại mật khẩu"
        }!`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

const verifyOtp = (req, res) => {
  const { type, email, otp } = req.body;

  if (!["register", "reset-password"].includes(type)) {
    return res.status(400).json({ message: "Loại OTP không hợp lệ!" });
  }
  if (!otpStore[email] || !otpStore[email][type])
    return res
      .status(400)
      .json({ message: "OTP không tồn tại hoặc đã hết hạn!" });
  const storedOtp = otpStore[email][type];

  if (Date.now() > storedOtp.expiresAt) {
    delete otpStore[email][type];
    return res.status(400).json({ message: "OTP đã hết hạn!" });
  }

  // Kiểm tra OTP có khớp không
  if (storedOtp.otp !== otp) {
    return res.status(400).json({ message: "OTP không chính xác!" });
  }

  // Đánh dấu OTP là đã xác minh
  storedOtp.isVerified = true;
  res.status(200).json({ message: "OTP xác thực thành công!" });
};

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt!",
      });
    }

    const storedOtp = otpStore[email]?.["register"];

    if (!storedOtp || !storedOtp.isVerified)
      return res.status(400).json({ message: "Chưa xác thực OTP!" });

    // Kiểm tra OTP có hết hạn không
    if (Date.now() > storedOtp.expiresAt) {
      delete otpStore[email]["register"];
      return res.status(400).json({ message: "OTP đã hết hạn!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
    });
    await newUser.save();

    delete otpStore[email]["register"]; // Xóa OTP sau khi đăng ký thành công
    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không đúng!" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ userId: decoded.id, role: decoded.role });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const storedOtp = otpStore[email]?.["reset-password"];
  if (!storedOtp || !storedOtp.isVerified)
    return res.status(400).json({ message: "Chưa xác thực OTP!" });
  // Kiểm tra OTP có hết hạn không
  if (Date.now() > storedOtp.expiresAt) {
    delete otpStore[email]["reset-password"];
    return res.status(400).json({ message: "OTP đã hết hạn!" });
  }
  // Xóa OTP sau khi sử dụng
  delete otpStore[email]["resetPassword"];

  // Cập nhật mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try{
    await User.updateOne({ email }, { password: hashedPassword });
    res.status(200).json({ message: "Mật khẩu đã được cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống!" });
  }
};
const authController = {
  sendOtp,
  verifyOtp,
  register,
  login,
  logout,
  getMe,
  resetPassword,
};

module.exports = authController;
