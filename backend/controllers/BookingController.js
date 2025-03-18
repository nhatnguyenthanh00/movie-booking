const Booking = require("../models/Booking");
const Showtime = require("../models/Showtime");
const createBooking = async (req, res) => {
  const userId = req?.user?._id;
  try {
    const newBooking = await Booking.create({ ...req.body, user: userId });
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getBookingByMovieId = async (req, res) => {
  const { movieId } = req.params;

  try {
    const showtimes = await Showtime.find({ movie: movieId }).select("_id");
    if (showtimes.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy showtime nào cho bộ phim này" });
    }
    const bookings = await Booking.find({
      showtime: { $in: showtimes.map((s) => s._id) },
    })
      .populate("user", "name email")
      .select("email");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy booking nào cho bộ phim này" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getCustomerByShowtimeId = async (req, res) => {
  const { movieId } = req.params;
  const { showtimeId } = req.params;

  try {
    const showtimes = await Showtime.find({ movie: movieId }).select("_id");
    if (showtimes.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy showtime nào cho bộ phim này" });
    }
    const bookings = await Booking.find({
      showtime: showtimeId,
    })
      .populate("user", "name email")
      .select("email");

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy booking nào cho bộ phim này" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const getInfoBooking = async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await Booking.findById(bookingId)
      .populate("showtime", "pricing") // Lấy giá vé từ showtime
      .populate({
        path: "seats.seat",
        populate: { path: "room", select: "name" }, // Lấy thông tin phòng chiếu
      });

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt vé" });
    }

    // Lấy danh sách số ghế và phòng chiếu
    const seatNumbers = booking.seats.map((s) => s.seat.seatNumber);
    const roomName =
      booking.seats.length > 0 ? booking.seats[0].seat.room.name : null;

    // Tính tổng tiền
    let totalPrice = booking.seats.reduce((total, s) => {
      const seatType = s.seat.type;
      const price = booking.showtime.pricing[seatType] || 0;
      return total + price;
    }, 0);

    res.status(200).json({ totalPrice, seatNumbers, roomName });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const bookingController = {
  createBooking,
  getInfoBooking,
  getBookingByMovieId,
  getCustomerByShowtimeId,
};
module.exports = bookingController;
