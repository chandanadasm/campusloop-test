const Resource = require('../models/Resource');

// @desc    Create new Resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res) => {
    const { title, description, type, price, contact } = req.body;

    if (!title || !description || !type || !contact) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    const resource = await Resource.create({
        title,
        description,
        type,
        price,
        contact,
        uploadedBy: req.user.id,
        userName: req.user.name
    });

    res.status(201).json(resource);
};

// @desc    Get all Resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res) => {
    const { type } = req.query;
    let query = {};
    if (type) {
        query.type = type;
    }
    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
};

// @desc    Delete Resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res) => {
    const resource = await Resource.findById(req.params.id);

    if (!resource) return res.status(404).json({ message: 'Resource not found' });

    // Check for user
    if (resource.uploadedBy.toString() !== req.user.id) {
        return res.status(401).json({ message: 'User not authorized' });
    }

    await resource.deleteOne();
    res.json({ id: req.params.id });
};

module.exports = {
    createResource,
    getResources,
    deleteResource
};
