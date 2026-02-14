const Chat = require('../models/Chat');

// POST /api/chat
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Message is required' });

        const chat = await Chat.create({
            senderId: req.user._id,
            senderName: req.user.name,
            message,
            role: 'student'
        });
        return res.status(201).json(chat);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/chat
const getChat = async (req, res) => {
    try {
        const messages = await Chat.find().sort({ createdAt: 1 });
        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { sendMessage, getChat };
