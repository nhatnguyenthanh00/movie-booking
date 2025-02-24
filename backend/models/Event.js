const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: {
        type: Date,
        required: true,
        validator: function (value) { return this.startTime < value; } 
    },
    homePageUrl: { type: String },
    detailUrl: { type: String, required: true },
    isMainEvent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', eventSchema);