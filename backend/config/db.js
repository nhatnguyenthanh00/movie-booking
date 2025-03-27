const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie");
const Room = require("../models/Room");
const Seat = require("../models/Seat");
const Showtime = require("../models/Showtime");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Event = require("../models/Event");
const DB = {};
DB.user = User;
DB.movie = Movie;
DB.room = Room;
DB.seat = Seat;
DB.showtime = Showtime;
DB.booking = Booking;
DB.review = Review;
DB.event = Event;

DB.connectDB = async () => {
  try {
    // Thử kết nối với MongoDB Atlas trước
    await mongoose.connect(process.env.DB_CONNECTION_CLOUD, {
      dbName: process.env.DB_NAME,
    });
    console.log("✅ Connected to the cloud database (MongoDB Atlas)");
  } catch (err) {
    console.error("❌ Cloud database connection failed. Trying local...");

    try {
      // Nếu thất bại, thử kết nối với MongoDB local
      await mongoose.connect(process.env.DB_CONNECTION_LOCAL, {
        dbName: process.env.DB_NAME,
      });
      console.log("✅ Connected to the local database (MongoDB)");
    } catch (localErr) {
      console.error("❌ Could not connect to any database", localErr);
      process.exit(1); // Dừng chương trình nếu không thể kết nối với bất kỳ DB nào
    }
  }
};

module.exports = DB;