const User = require('../models/User');
const Event = require('../models/Event');

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
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ error: "Event không tồn tại" });
        res.json({ message: "Event đã được xóa" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const adminController = {
    getAllUsers,
    changeStatusUser,
    addNewEvent,
    updateEvent,
    deleteEvent
};
module.exports = adminController;