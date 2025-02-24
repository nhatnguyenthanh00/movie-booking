const Movie = require('../models/Movie');
const getAllMoviePoster = async (req, res) => {
    try {
        const movies = await Movie.find().select('_id posterUrl releaseDate endDate');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
}
const movieController = {getAllMoviePoster};
module.exports = movieController;