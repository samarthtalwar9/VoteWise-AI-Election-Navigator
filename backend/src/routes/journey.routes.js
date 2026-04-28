const express = require('express');
const router = express.Router();
const GuidanceAgent = require('../agents/GuidanceAgent');
const TimelineAgent = require('../agents/TimelineAgent');
const verifyToken = require('../middleware/auth.middleware');

// Basic in-memory cache for efficiency
const journeyCache = new Map();

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { age, location, firstTimeVoter, language } = req.body;

    // Input Validation
    if (age === undefined || !location || typeof firstTimeVoter === 'undefined') {
      return res.status(400).json({ error: 'Missing required fields: age, location, or firstTimeVoter.' });
    }

    if (isNaN(age) || age < 0) {
      return res.status(400).json({ error: 'Invalid age provided.' });
    }
    
    // Check cache
    const cacheKey = `${age}-${location}-${firstTimeVoter}-${language}`;
    if (journeyCache.has(cacheKey)) {
      console.log('Serving journey from cache');
      return res.status(200).json(journeyCache.get(cacheKey));
    }

    // Step 1: Guidance Agent determines next step & explanation
    const guidanceOutput = await GuidanceAgent.determineNextStep({ age, location, firstTimeVoter, language });

    // Step 2: Timeline Agent adds deadlines based on next step
    const timelineOutput = await TimelineAgent.generateTimeline({ location, next_step: guidanceOutput.next_step, language });

    // Combine into final structured response
    const finalResponse = {
      next_step: guidanceOutput.next_step,
      timeline: timelineOutput.timeline || [],
      explanation: guidanceOutput.explanation
    };
    
    // Save to cache
    journeyCache.set(cacheKey, finalResponse);

    res.status(200).json(finalResponse);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
