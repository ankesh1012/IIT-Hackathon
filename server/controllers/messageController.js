// server/controllers/messageController.js
const Message = require('../models/Message');

// @desc    Get message history between the logged-in user and another user
// @route   GET /api/messages/:otherUserId
// @access  Private
exports.getMessageHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const otherUserId = req.params.otherUserId;

        if (userId.toString() === otherUserId.toString()) {
            return res.status(400).json({ message: "Cannot fetch chat history with yourself." });
        }

        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: otherUserId },
                { sender: otherUserId, recipient: userId },
            ],
        })
        .sort({ createdAt: 1 })
        .populate('sender', 'name')
        .select('sender content createdAt');
        
        res.json(messages);
    } catch (error) {
        console.error("Error fetching message history:", error);
        res.status(500).json({ message: 'Server error fetching message history.' });
    }
};