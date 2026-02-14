const Review = require('../models/Review');

// @desc    Create new Review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { hostelName, rating, reviewText } = req.body;

    if (!hostelName || !rating || !reviewText) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    const review = await Review.create({
        hostelName,
        rating,
        reviewText,
        createdBy: req.user.id,
        userName: req.user.name
    });

    res.status(201).json(review);
};

// @desc    Get All Reviews
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
};

module.exports = {
    createReview,
    getReviews
};
