const Area = require('../models/Area');
const User = require('../models/User');

// @desc    Create new Area
// @route   POST /api/areas
// @access  Private
const createArea = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Area name is required' });

    const areaExists = await Area.findOne({ name });
    if (areaExists) return res.status(400).json({ message: 'Area already exists' });

    const area = await Area.create({
        name,
        createdBy: req.user.id,
        members: [req.user.id] // Creator auto-joins
    });

    // Update user's joinedArea
    await User.findByIdAndUpdate(req.user.id, { joinedArea: area.id });

    res.status(201).json(area);
};

// @desc    Get all Areas
// @route   GET /api/areas
// @access  Public
const getAreas = async (req, res) => {
    const areas = await Area.find().populate('members', 'name score');
    res.json(areas);
};

// @desc    Get Single Area
// @route   GET /api/areas/:id
// @access  Private
const getArea = async (req, res) => {
    const area = await Area.findById(req.params.id).populate('members', 'name score vehicleType ridePreference');
    if (!area) return res.status(404).json({ message: 'Area not found' });
    res.json(area);
};

// @desc    Join Area
// @route   POST /api/areas/:id/join
// @access  Private
const joinArea = async (req, res) => {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });

    // Check if user is already in an area
    if (req.user.joinedArea) {
        return res.status(400).json({ message: 'You are already in an area. Leave it first.' });
    }

    area.members.push(req.user.id);
    await area.save();

    await User.findByIdAndUpdate(req.user.id, { joinedArea: area.id });

    res.json({ message: 'Joined area successfully' });
};

// @desc    Leave Area
// @route   POST /api/areas/:id/leave
// @access  Private
const leaveArea = async (req, res) => {
    const area = await Area.findById(req.params.id);
    if (!area) return res.status(404).json({ message: 'Area not found' });

    area.members = area.members.filter(memberId => memberId.toString() !== req.user.id);
    await area.save();

    await User.findByIdAndUpdate(req.user.id, { joinedArea: null });

    res.json({ message: 'Left area successfully' });
};

// @desc    Update Ride Details
// @route   PUT /api/areas/update-ride
// @access  Private
const updateRideDetails = async (req, res) => {
    const { vehicleType, ridePreference } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, {
        vehicleType: vehicleType || req.user.vehicleType,
        ridePreference: ridePreference || req.user.ridePreference
    }, { new: true });

    res.json(user);
};

module.exports = {
    createArea,
    getAreas,
    getArea,
    joinArea,
    leaveArea,
    updateRideDetails
};
