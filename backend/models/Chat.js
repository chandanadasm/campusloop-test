const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, enum: ['student', 'senior', 'admin'], default: 'student' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
