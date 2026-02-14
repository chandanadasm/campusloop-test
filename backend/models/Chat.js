const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    role: { type: String, enum: ['student', 'senior', 'admin'], default: 'student' }
}, {
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
