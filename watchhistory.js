const mongoose = require('mongoose');

const watchHistorySchema = new mongoose.Schema({
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
    title: String,
    poster: String,
    progress: {
        type: Number,
        default: 0
    },
    duration: Number,
    lastWatched: {
        type: Date,
        default: Date.now
    }
});

watchHistorySchema.index({ userId: 1, contentId: 1 });

module.exports = mongoose.model('WatchHistory', watchHistorySchema);