const Showtime = require("../models/Showtime");

const getShowtimeByDay = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    if (!date || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res
        .status(400)
        .json({ message: "Vui lòng cung cấp ngày (YYYY-MM-DD)" });
    }
    // Chuyển đổi date thành phạm vi từ 00:00:00 đến 23:59:59
    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    const showtimes = await Showtime.find({
      movie: movieId,
      startTime: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("movie")
      .populate("room")
      .populate("seats.seatId", "seatNumber type status -_id");

    res.status(200).json(showtimes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const addShowtime = async (req, res) => {
  const { movieId } = req.params;
  const { startTime, endTime, roomId, type, pricing } = req.body;

  try {
    const showtime = await Showtime.create({
      movie: movieId,
      startTime,
      endTime,
      room: roomId,
      type,
      pricing,
    });

    res.status(201).json(showtime);
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      // Nếu là lỗi validation của Mongoose, trả về chi tiết lỗi
      return res
        .status(400)
        .json({ message: "Validation Error", errors: error.errors });
    }

    // Nếu là lỗi khác, trả về lỗi server
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const showtimeController = {
  getShowtimeByDay,
  addShowtime,
};
module.exports = showtimeController;
