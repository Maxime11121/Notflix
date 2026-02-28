const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Review = require('../models/Review');

// Get reviews for content
router.get('/reviews/:contentId', async (req, res) => {
    try {
        const reviews = await Review.find({ contentId: req.params.contentId })
            .populate('userId', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(50);
        
        res.json({ reviews });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Post review
router.post('/reviews', authMiddleware, async (req, res) => {
    try {
        const { contentId, contentType, rating, text, spoiler } = req.body;
        
        // Check if user already reviewed
        let review = await Review.findOne({
            userId: req.user._id,
            contentId
        });
        
        if (review) {
            review.rating = rating;
            review.text = text;
            review.spoiler = spoiler;
        } else {
            review = new Review({
                userId: req.user._id,
                contentId,
                contentType,
                rating,
                text,
                spoiler
            });
        }
        
        await review.save();
        await review.populate('userId', 'username avatar');
        
        res.json({ review });
    } catch (error) {
        res.status(500).json({ error: 'Post failed' });
    }
});

// Like review
router.post('/reviews/:reviewId/like', authMiddleware, async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        
        const index = review.likedBy.indexOf(req.user._id);
        
        if (index > -1) {
            review.likedBy.splice(index, 1);
            review.likes = Math.max(0, review.likes - 1);
        } else {
            review.likedBy.push(req.user._id);
            review.likes += 1;
        }
        
        await review.save();
        res.json({ likes: review.likes });
    } catch (error) {
        res.status(500).json({ error: 'Like failed' });
    }
});

module.exports = router;