const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    number: { type: Number }
});

module.exports = mongoose.model('Room', roomSchema);