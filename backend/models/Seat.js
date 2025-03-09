const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  type: {
    type: String,
    enum: ['normal','vip','couple'],
    default: 'normal',
  }
});

module.exports = mongoose.model("Seat", seatSchema);
