const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Movie',
        required: true
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) { return this.startTime < value; },
            message: "End time must be after start time"
        },
        default: function () { 
            return new Date(this.startTime.getTime() + 150 * 60 * 1000); // default end time is 150 minutes after start time
        }
    },
    type: {
        type: String,
        enum: ['2D','3D','IMAX'],
        required: true
    },
    pricing: {
        normal: Number,
        vip: Number,
        couple: Number
    },
    seats: [
        {
            seatId: {type: mongoose.Schema.Types.ObjectId, ref: 'Seat'},
            status: {
                type: String,
                enum: ['available', 'booked'],
                default: 'available'
            }
        }
    ]
    ,
    status: {
        type: String,
        enum: ['open','closed'],
        default: 'open'
    }
}, {timestamps : true});

showtimeSchema.pre('validate', async function (next) {
    try {
        const Movie = mongoose.model('Movie');

        // Lấy thông tin movie để lấy duration
        const movie = await Movie.findById(this.movie).select('duration');
        const Showtime = mongoose.model('Showtime');
        
        if (!movie) {
            return next(new Error("Movie không tồn tại!"));
        }

        // Chỉ kiểm tra endTime nếu startTime và endTime hợp lệ
        if (this.startTime instanceof Date && !isNaN(this.startTime) &&
            this.endTime instanceof Date && !isNaN(this.endTime)) {
            
            // Tính toán thời gian kết thúc tối thiểu
            const minEndTime = new Date(this.startTime.getTime() + movie.duration * 60 * 1000);

            if (this.endTime < minEndTime) {
                return next(new Error(`EndTime phải >= StartTime + ${movie.duration} phút`));
            }
        }

        // **Kiểm tra xung đột suất chiếu trong cùng phòng**
        const conflictShowtime = await Showtime.findOne({
            room: this.room,
            $or: [
                { startTime: { $lt: this.endTime }, endTime: { $gt: this.startTime } }
            ]
        });

        if (conflictShowtime) {
            return next(new Error("Phòng đã có suất chiếu bị trùng lịch!"));
        }

        next();
    } catch (error) {
        next(error);
    }
});

showtimeSchema.pre('save', async function (next) {
    if (!this.isNew) return next(); // Chỉ chạy khi tạo mới
    
    const Seat = mongoose.model('Seat');

    try {
        // Lấy danh sách ghế theo room
        const seats = await Seat.find({ room: this.room }).select('_id');

        // Gán tất cả ghế vào danh sách seats của Showtime
        this.seats = seats.map(seat => ({
            seatId: seat._id,
            status: 'available'
        }));

        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Showtime", showtimeSchema);