const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true, default: '' },
    genre: [String],
    language: { type: String, required: true },
    subtitles: [String],
    director: [String],
    casts: [String],
    rating: {
        type: String,
        enum: ['P', 'C13', 'C16', 'C18'],
        default: 'P',
    },
    duration: { type: Number, required: true },
    posterUrl: String,
    imageUrl: String,
    trailerUrl: String,
    releaseDate: { type: Date, required: true },
    endDate: {
        type: Date,
        validate: {
            validator: function (value) { return this.releaseDate < value; },
            message: "End date must be after release date"
        },
        default: function () {
            return new Date(this.releaseDate.getTime() + 2 * 30 * 24 * 60 * 60 * 1000); // default end date is 2 months after release date
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);