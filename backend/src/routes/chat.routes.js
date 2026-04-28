const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { handleChatQuery } = require('../controllers/chat.controller');

// POST /api/chat
router.post('/', verifyToken, handleChatQuery);

module.exports = router;
