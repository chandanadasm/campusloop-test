const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Notes', 'PYQ', 'Book', 'Equipment', 'Other'], required: true },
    price: { type: String, default: 'Free' },
    contact: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true } // Denormalized for easier display
}, {
    timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);
module.exports = Resource;
