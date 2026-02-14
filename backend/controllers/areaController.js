const Area = require('../models/Area');
const User = require('../models/User');

// POST /api/areas — Create new area
const createArea = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Area name is required' });

        const exists = await Area.findOne({ name });
        if (exists) return res.status(400).json({ message: 'Area already exists' });

        const area = await Area.create({
            name,
            createdBy: req.user._id,
            members: [req.user._id]
        });

        await User.findByIdAndUpdate(req.user._id, { joinedArea: area._id });
        return res.status(201).json(area);
    } catch (error) {
        console.error('Create area error:', error);
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/areas
const getAreas = async (req, res) => {
    try {
        const areas = await Area.find().populate('members', 'name score');
        return res.json(areas);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/areas/:id
const getArea = async (req, res) => {
    try {
        const area = await Area.findById(req.params.id).populate('members', 'name score vehicleType ridePreference');
        if (!area) return res.status(404).json({ message: 'Area not found' });
        return res.json(area);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/areas/:id/join
const joinArea = async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        if (!area) return res.status(404).json({ message: 'Area not found' });

        if (req.user.joinedArea) {
            return res.status(400).json({ message: 'You are already in an area. Leave it first.' });
        }

        area.members.push(req.user._id);
        await area.save();
        await User.findByIdAndUpdate(req.user._id, { joinedArea: area._id });
        return res.json({ message: 'Joined area successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// POST /api/areas/:id/leave
const leaveArea = async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        if (!area) return res.status(404).json({ message: 'Area not found' });

        area.members = area.members.filter(id => id.toString() !== req.user._id.toString());
        await area.save();
        await User.findByIdAndUpdate(req.user._id, { joinedArea: null });
        return res.json({ message: 'Left area successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// PUT /api/areas/update-ride
const updateRideDetails = async (req, res) => {
    try {
        const { vehicleType, ridePreference } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { vehicleType, ridePreference }, { new: true });
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createArea, getAreas, getArea, joinArea, leaveArea, updateRideDetails };
