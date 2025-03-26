const Movie = require("../models/Movie");
const Review = require("../models/Review");
const getAllMoviePoster = async (req, res) => {
  try {
    const movies = await Movie.find().select(
      "_id posterUrl releaseDate endDate title genre"
    );
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getMovieDetailById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
};

const getReviewsByMovieId = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    const reviews = await Review.find({ movie: movie._id })
      .populate("user", "email -_id")
      .select("-__v -movie");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
};
const movieController = {
  getAllMoviePoster,
  getMovieDetailById,
  getReviewsByMovieId,
};

module.exports = movieController;
