const crypto = require("crypto");
const qs = require("qs");
const moment = require("moment");
const VNP_TMNCODE = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
const VNP_URL = process.env.VNP_URL;
const VNP_RETURNURL = process.env.VNP_RETURNURL;
const Booking = require("../models/Booking");
const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

const createPayment = async (req, res) => {
  const { amount, orderInfo } = req.body;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: VNP_TMNCODE,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: moment().format("YYYYMMDDHHmmss"),
    vnp_OrderInfo: orderInfo || "Thanh toán vé xem phim",
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // Convert VND to VNPAY format
    vnp_ReturnUrl: VNP_RETURNURL,
    vnp_IpAddr: req.ip,
    vnp_CreateDate: moment().format("YYYYMMDDHHmmss"),
  };

  vnp_Params = sortObject(vnp_Params);

  // 🔑 Tạo signature (Chữ ký bảo mật)
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  // 🔗 Tạo link thanh toán
  const paymentUrl = `${VNP_URL}?${qs.stringify(vnp_Params, {
    encode: false,
  })}`;
  res.json({ paymentUrl });
};

const getPaymentReturn = async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];
  const bookingId = vnp_Params["vnp_OrderInfo"];
  const booking = Booking.findById(bookingId);
  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  // 📌 Kiểm tra chữ ký
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", VNP_HASHSECRET);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    if (vnp_Params["vnp_ResponseCode"] === "00") {
      // Cập nhật trạng thái booking
      booking.paymentStatus = "paid";
      await booking.save();
      res
        .status(200)
        .json({ message: "Thanh toán thành công!", status: "success" });
    } else {
      booking.paymentStatus = "cancelled";
      await booking.save();
      res.status(400).json({ message: "Thanh toán thất bại!", status: "fail" });
    }
  } else {
    res.status(400).json({ message: "Sai chữ ký bảo mật!" });
  }
};

const paymentController = { createPayment, getPaymentReturn };
module.exports = paymentController;
