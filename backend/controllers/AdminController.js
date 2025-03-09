const User = require('../models/User');
const Event = require('../models/Event');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const Review = require('../models/Review');
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

const changeStatusUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.status = !user.status;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addNewEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.validate(); // Kiểm tra validation trước khi lưu
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Event không tồn tại" });

        // Cập nhật thông tin sự kiện
        Object.assign(event, req.body);
        await event.validate(); // Kiểm tra validation trước khi cập nhật
        const updatedEvent = await event.save();
        res.status(200).json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: "Event không tồn tại" });
        res.status(200).json({ message: "Event đã được xóa" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
}


const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: "Movie not found" });

        const forbiddenFields = ["duration", "releaseDate", "endDate"];
        // Loại bỏ các trường không cho phép
        forbiddenFields.forEach(field => delete req.body[field]);

        // Cập nhật thông tin sự kiện
        Object.assign(movie, req.body);
        await movie.validate(); // Kiểm tra validation trước khi cập nhật
        const updatedMovie = await movie.save();
        res.status(200).json(updatedMovie);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: "Movie not found" });

        // Sau khi xóa suất chiếu, tiến hành xóa Movie
        await movie.deleteOne();
        
        res.status(200).json({ message: "Movie and all related showtimes have been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getShowtimesByMovieId = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ error: "Movie not found" });
        const showtimes = await Showtime.find({ movie: movie._id }).populate('room');
        res.status(200).json(showtimes);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addShowtime = async (req, res) => {
    const { movieId } = req.params;
    const { startTime, endTime,roomId, type, pricing, } = req.body;

    try {
        const showtime = await Showtime.create({
            movie: movieId,
            startTime,
            endTime,
            room: roomId,
            type,
            pricing,
        });

        res.status(201).json({message: "Showtime has been created"});
    } catch (error) {
        console.log(error);
        if (error.name === 'ValidationError') {
            // Nếu là lỗi validation của Mongoose, trả về chi tiết lỗi
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }

        // Nếu là lỗi khác, trả về lỗi server
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteShowtime = async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        if (!showtime) return res.status(404).json({ error: "Showtime not found" });
        res.status(200).json({ message: "Showtime has been deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const adminController = {
    getAllUsers,
    changeStatusUser,
    addNewEvent,
    updateEvent,
    deleteEvent,
    getAllMovies,
    updateMovie,
    deleteMovie,
    getShowtimesByMovieId,
    addShowtime,
    deleteShowtime,
};
module.exports = adminController;