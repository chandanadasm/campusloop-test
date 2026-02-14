const express = require('express');
const router = express.Router();
const { sendMessage, getChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/', getChat);

module.exports = router;
