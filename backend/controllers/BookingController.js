const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json(error);
    }
};

const bookingController = {};
module.exports = bookingController;