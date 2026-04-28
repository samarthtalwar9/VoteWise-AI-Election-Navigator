const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth.middleware');
const { generateJourney } = require('../controllers/journey.controller');

// POST /api/journey
router.post('/', verifyToken, generateJourney);

module.exports = router;
