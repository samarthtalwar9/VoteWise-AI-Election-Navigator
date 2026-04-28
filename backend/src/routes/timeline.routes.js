const express = require('express');
const router = express.Router();
const TimelineAgent = require('../agents/TimelineAgent');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { location, next_step, language } = req.body;

    if (!location || !next_step) {
      return res.status(400).json({ error: 'Missing required fields: location, next_step' });
    }

    const timelineOutput = await TimelineAgent.generateTimeline({ location, next_step, language });
    res.status(200).json(timelineOutput);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
