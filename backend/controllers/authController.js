const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        console.log('📝 Register request body:', JSON.stringify(req.body));
        const { name, email, password, college } = req.body;

        if (!name || !email || !password) {
            console.log('❌ Missing fields:', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ message: 'Please provide name, email, and password' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Create user (password is hashed in pre-save hook)
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            college: college || 'Not Specified'
        });

        console.log('✅ User created:', user._id, user.name);

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            score: user.score || 0,
            token: generateToken(user._id),
        });
    } catch (error) {
        console.error('❌ Register error:', error);
        return res.status(500).json({ message: 'Server error during registration: ' + error.message });
    }
};

// POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        console.log('🔐 Login request body:', JSON.stringify(req.body));
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            console.log('❌ No user found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials - user not found' });
        }

        const isMatch = await user.matchPassword(password);
        console.log('🔑 Password match result:', isMatch);

        if (isMatch) {
            console.log('✅ Login successful:', user.name);
            return res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                score: user.score || 0,
                token: generateToken(user._id),
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials - wrong password' });
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        return res.status(500).json({ message: 'Server error during login: ' + error.message });
    }
};

// GET /api/auth/me
const getMe = async (req, res) => {
    return res.status(200).json(req.user);
};

module.exports = { registerUser, loginUser, getMe };
