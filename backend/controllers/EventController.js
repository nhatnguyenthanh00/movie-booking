const Event = require("../models/Event");


const getAllEvent = async (req, res) => {
    try {
        const events = await Event.find().select('homePageUrl startTime endTime _id');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllEventHomePage = async (req, res) => {
    try {
        const events = await Event.find({ isMainEvent: true }).select('homePageUrl _id');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addEvent = async (req, res) => {
    try {
        const event = await Event.create(req.body);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json(error);
    }
}

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true, runValidators: true });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json(error);
    }
}

const eventController = {getAllEvent, getAllEventHomePage, getEventById, addEvent, updateEvent};
module.exports = eventController;