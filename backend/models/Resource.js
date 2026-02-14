const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Notes', 'PYQ', 'Book', 'Equipment', 'Other'], required: true },
    price: { type: String, default: 'Free' },
    contact: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
