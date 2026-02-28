const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contentId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    text: {
        type: String,
        required: true,
        maxlength: 2000
    },
    spoiler: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reviewSchema.index({ contentId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);