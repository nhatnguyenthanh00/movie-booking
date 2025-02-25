const Movie = require('../models/Movie');
const Review = require('../models/Review');
const getAllMoviePoster = async (req, res) => {
    try {
        const movies = await Movie.find().select('_id posterUrl releaseDate endDate');
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMovieDetailById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.movieId);
        if(!movie) {
            return res.status(404).json({message: 'Movie not found'});
        }
        const reviews = await Review.find({movie: movie._id})
            .populate('user', 'email -_id')
            .select('-__v -_id -movie');

        const averageRating = reviews.length > 0 
            ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length ).toFixed(1)
            : "0.0";        
        res.status(200).json({movie, reviews, averageRating});
    } catch (error) {
        res.status(500).json(error);
    }
}
const movieController = {getAllMoviePoster, getMovieDetailById};
module.exports = movieController;