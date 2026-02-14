const express = require('express');
const router = express.Router();
const { createArea, getAreas, getArea, joinArea, leaveArea, updateRideDetails } = require('../controllers/areaController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createArea);
router.get('/', getAreas);
router.get('/:id', getArea);
router.post('/:id/join', protect, joinArea);
router.post('/:id/leave', protect, leaveArea);
router.put('/update-ride', protect, updateRideDetails);

module.exports = router;
