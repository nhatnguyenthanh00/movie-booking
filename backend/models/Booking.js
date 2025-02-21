const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    showtime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Showtime',
        required: true
    },
    seats: [
        {
            seat: {type: mongoose.Schema.Types.ObjectId, ref: 'Seat'},
            price: Number
        }
    ],
    paymentStatus: {
        type: String,
        enum: ['pending','paid','cancelled'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['online','offline'],
        required: true
    }
});

module.exports = mongoose.model("Booking",bookingSchema);