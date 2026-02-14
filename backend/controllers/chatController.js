const Chat = require('../models/Chat');

// @desc    Send Message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    const chat = await Chat.create({
        senderId: req.user.id,
        senderName: req.user.name,
        message,
        role: 'student' // Default for now
    });

    res.status(201).json(chat);
};

// @desc    Get Chat History
// @route   GET /api/chat
// @access  Public
const getChat = async (req, res) => {
    const messages = await Chat.find().sort({ createdAt: 1 }); // Oldest first
    res.json(messages);
};

module.exports = {
    sendMessage,
    getChat
};
