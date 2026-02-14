const express = require('express');
const router = express.Router();
const { createResource, getResources, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createResource);
router.get('/', getResources);
router.delete('/:id', protect, deleteResource);

module.exports = router;
