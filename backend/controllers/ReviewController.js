const Review = require("../models/Review");

const addNewReview = async (req, res) => {
  try {
    const userId = req?.user?._id;
    console.log(req?.user);
    const newReview = await Review.create({ ...req.body, user: userId });
    res.status(200).json(newReview);
  } catch (error) {
    res.status(500).json(error);
  }
};

const reviewController = { addNewReview };
module.exports = reviewController;
