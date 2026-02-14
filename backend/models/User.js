const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'Password is required'], minlength: 6 },
    college: { type: String, default: 'Not Specified' },
    score: { type: Number, default: 0 },
    joinedArea: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', default: null },
    vehicleType: { type: String, default: 'None' },
    ridePreference: { type: String, enum: ['Driver', 'Passenger', 'Both', 'None'], default: 'None' },
}, { timestamps: true });

// Hash password before saving — only if password field was modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
