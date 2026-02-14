const Resource = require('../models/Resource');

// POST /api/resources
const createResource = async (req, res) => {
    try {
        const { title, description, type, price, contact } = req.body;
        if (!title || !description || !type || !contact) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }
        const resource = await Resource.create({
            title, description, type, price, contact,
            uploadedBy: req.user._id,
            userName: req.user.name
        });
        return res.status(201).json(resource);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// GET /api/resources
const getResources = async (req, res) => {
    try {
        const query = req.query.type ? { type: req.query.type } : {};
        const resources = await Resource.find(query).sort({ createdAt: -1 });
        return res.json(resources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// DELETE /api/resources/:id
const deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).json({ message: 'Resource not found' });
        if (resource.uploadedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await resource.deleteOne();
        return res.json({ id: req.params.id });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createResource, getResources, deleteResource };
