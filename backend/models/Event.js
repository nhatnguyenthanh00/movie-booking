const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                return this.startTime < value;
            },
            message: "endTime phải lớn hơn startTime!"
        }
    },
    homePageUrl: { type: String, required: true },
    detailUrl: { type: String, required: true },
    isMainEvent: { type: Boolean, default: false },
    noticeContent: { type: String, default: '' },
});

module.exports = mongoose.model('Event', eventSchema);