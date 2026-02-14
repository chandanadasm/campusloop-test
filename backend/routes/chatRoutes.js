const express = require('express');
const router = express.Router();
const { sendMessage, getChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getChat).post(protect, sendMessage);

module.exports = router;
