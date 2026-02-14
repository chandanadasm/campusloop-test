const mongoose = require('mongoose');

const areaSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs
}, {
    timestamps: true
});

// Virtual for member count
areaSchema.virtual('memberCount').get(function () {
    return this.members.length;
});

const Area = mongoose.model('Area', areaSchema);
module.exports = Area;
