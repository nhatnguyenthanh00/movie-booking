const Showtime = require("../models/Showtime");

const getAllShowtime = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    let filter = { movie: movieId };

    if (date) {
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp ngày hợp lệ (YYYY-MM-DD)" });
      }

      // Chuyển đổi date thành phạm vi từ 00:00:00 đến 23:59:59
      const startOfDay = new Date(date + "T00:00:00.000Z");
      const endOfDay = new Date(date + "T23:59:59.999Z");

      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const showtimes = await Showtime.find(filter)
      .populate("room")
      .populate("seats.seatInfo", "seatNumber type status -_id");

    const formattedShowtimes = showtimes.map((showtime) => {
      const showtimeObject = showtime.toObject();
      showtimeObject.seatSummary = {
        total: showtimeObject.seats.length,
        booked: showtimeObject.seats.filter((seat) => seat.status === "booked")
          .length,
      };
      delete showtimeObject.seats;

      return showtimeObject;
    });

    res.status(200).json(formattedShowtimes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};


const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.showtimeId)
      .populate("room", "-_id")
      .populate("seats.seatInfo", "seatNumber type status -_id")
      .populate("movie", "title -_id");
    if (!showtime) return res.status(404).json({ error: "Showtime not found" });
    res.status(200).json(showtime);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const showtimeController = {
  getAllShowtime,
  getShowtimeById,
};
module.exports = showtimeController;
