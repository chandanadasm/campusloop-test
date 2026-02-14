const Review = require('../models/Review');

// POST /api/reviews
const createReview = async (req, res) => {
    try {
        const { hostelName, rating, reviewText } = req.body;
        if (!hostelName || !rating || !reviewText) {
            return res.status(400).json({ message: 'Please add all fields' });
        }
        const review = await Review.create({
            hostelName, rating: Number(rating), reviewText,
            createdBy: req.user._id,
            userName: req.user.name
        });
        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/reviews
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        return res.json(reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, getReviews };
