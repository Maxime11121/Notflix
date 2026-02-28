const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const WatchHistory = require('../models/WatchHistory');

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { username, email, avatar, preferences } = req.body;
        
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (avatar) updateData.avatar = avatar;
        if (preferences) updateData.preferences = preferences;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json({ user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(400).json({ error: 'Update failed' });
    }
});

// Get watch history
router.get('/watch-history', authMiddleware, async (req, res) => {
    try {
        const history = await WatchHistory.find({ userId: req.user._id })
            .sort({ lastWatched: -1 })
            .limit(100);
        
        res.json({ history });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Save/Update watch progress
router.post('/watch-progress', authMiddleware, async (req, res) => {
    try {
        const { contentId, contentType, progress, duration, title, poster } = req.body;
        
        let history = await WatchHistory.findOne({
            userId: req.user._id,
            contentId
        });
        
        if (history) {
            history.progress = progress;
            history.duration = duration;
            history.lastWatched = Date.now();
        } else {
            history = new WatchHistory({
                userId: req.user._id,
                contentId,
                contentType,
                title,
                poster,
                progress,
                duration
            });
        }
        
        await history.save();
        
        // Update user watch time
        await User.findByIdAndUpdate(req.user._id, {
            $inc: {
                'watchTime.total': progress,
                'watchTime.thisWeek': progress,
                'watchTime.thisMonth': progress
            }
        });
        
        res.json({ success: true, history });
    } catch (error) {
        console.error('Save progress error:', error);
        res.status(500).json({ error: 'Save failed' });
    }
});

// Get My List
router.get('/my-list', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ myList: user.myList });
    } catch (error) {
        console.error('Get my list error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add/Remove from My List
router.post('/my-list', authMiddleware, async (req, res) => {
    try {
        const { contentId, contentType, title, poster } = req.body;
        
        const user = await User.findById(req.user._id);
        
        const existingIndex = user.myList.findIndex(
            item => item.contentId === contentId
        );
        
        if (existingIndex > -1) {
            // Remove from list
            user.myList.splice(existingIndex, 1);
        } else {
            // Add to list
            user.myList.unshift({
                contentId,
                contentType,
                title,
                poster,
                addedAt: new Date()
            });
        }
        
        await user.save();
        res.json({ myList: user.myList });
    } catch (error) {
        console.error('My list error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Friends - Add friend
router.post('/friends', authMiddleware, async (req, res) => {
    try {
        const { friendId } = req.body;
        
        if (friendId === req.user._id.toString()) {
            return res.status(400).json({ error: 'Cannot add yourself' });
        }
        
        const user = await User.findById(req.user._id);
        const friend = await User.findById(friendId);
        
        if (!friend) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const alreadyFriends = user.friends.some(
            f => f.userId.toString() === friendId
        );
        
        if (alreadyFriends) {
            return res.status(400).json({ error: 'Already friends' });
        }
        
        user.friends.push({
            userId: friendId,
            addedAt: new Date()
        });
        
        await user.save();
        res.json({ success: true, friends: user.friends });
    } catch (error) {
        console.error('Add friend error:', error);
        res.status(500).json({ error: 'Failed to add friend' });
    }
});

// Get friends list
router.get('/friends', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('friends.userId', 'username avatar');
        
        res.json({ friends: user.friends });
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get friends activity
router.get('/friends/activity', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const friendIds = user.friends.map(f => f.userId);
        
        const activity = await WatchHistory.find({
            userId: { $in: friendIds }
        })
        .populate('userId', 'username avatar')
        .sort({ lastWatched: -1 })
        .limit(20);
        
        res.json({ activity });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user stats
router.put('/stats', authMiddleware, async (req, res) => {
    try {
        const { watchTime, achievements } = req.body;
        
        const updateData = {};
        if (watchTime) updateData.watchTime = watchTime;
        if (achievements) updateData.achievements = achievements;
        
        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true }
        ).select('-password');
        
        res.json({ user });
    } catch (error) {
        console.error('Update stats error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Update preferences
router.put('/preferences', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { preferences: req.body },
            { new: true }
        ).select('-password');
        
        res.json({ preferences: user.preferences });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Get notifications
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ notifications: user.notifications || [] });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark notification as read
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const notification = user.notifications.id(req.params.id);
        
        if (notification) {
            notification.read = true;
            await user.save();
        }
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Mark all notifications as read
router.put('/notifications/read-all', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.notifications.forEach(n => n.read = true);
        await user.save();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Update failed' });
    }
});

// Search users (for adding friends)
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { query } = req.query;
        
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: req.user._id }
        })
        .select('username email avatar')
        .limit(10);
        
        res.json({ users });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;