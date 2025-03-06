const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    const userId = req?.user?._id;
    try {
        const newBooking = await Booking.create({...req.body, user: userId});
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getInfoBooking = async (req, res) => {
    const bookingId = req.params.id;
    try {
        const booking = await Booking.findById(bookingId)
            .populate('showtime', 'pricing') // Lấy giá vé từ showtime
            .populate({
                path: 'seats.seat',
                populate: { path: 'room', select: 'name' } // Lấy thông tin phòng chiếu
            });

        if (!booking) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt vé" });
        }

        // Lấy danh sách số ghế và phòng chiếu
        const seatNumbers = booking.seats.map(s => s.seat.seatNumber);
        const roomName = booking.seats.length > 0 ? booking.seats[0].seat.room.name : null;

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


const bookingController = {createBooking, getInfoBooking};
module.exports = bookingController;