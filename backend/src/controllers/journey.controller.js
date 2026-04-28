const GuidanceAgent = require('../agents/GuidanceAgent');
const TimelineAgent = require('../agents/TimelineAgent');
const { sendSuccess, sendError } = require('../utils/response.util');
const { db } = require('../utils/firebase'); // Import Firestore

// Basic in-memory cache for efficiency (could be moved to a Redis store in the future)
const journeyCache = new Map();

/**
 * Controller to handle the generation of a personalized voting journey.
 * Coordinates input validation, caching, and calling AI agents.
 * Logs generated journeys to Firestore if available.
 */
const generateJourney = async (req, res, next) => {
  try {
    const { age, location, firstTimeVoter, language } = req.body;

    // 1. Input Validation
    if (age === undefined || !location || typeof firstTimeVoter === 'undefined') {
      return sendError(res, 'Missing required fields: age, location, or firstTimeVoter.', 400);
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0) {
      return sendError(res, 'Invalid age provided.', 400);
    }

    if (parsedAge < 18) {
        // Handle underage edge case gracefully without throwing an AI error
        return sendSuccess(res, {
            next_step: "You are not yet eligible to vote.",
            timeline: [],
            explanation: "In most jurisdictions, you must be at least 18 years old to vote. You can still learn about the democratic process and prepare to register when you reach eligible age!"
        });
    }
    
    // 2. Check cache to save Gemini API calls and reduce latency
    const cacheKey = `${parsedAge}-${location}-${firstTimeVoter}-${language}`;
    if (journeyCache.has(cacheKey)) {
      console.log('Serving journey from cache');
      return sendSuccess(res, journeyCache.get(cacheKey));
    }

    // 3. Step 1: Guidance Agent determines next step & explanation
    const guidanceOutput = await GuidanceAgent.determineNextStep({ 
        age: parsedAge, 
        location, 
        firstTimeVoter, 
        language 
    });

    // 4. Step 2: Timeline Agent adds deadlines based on the determined next step
    const timelineOutput = await TimelineAgent.generateTimeline({ 
        location, 
        next_step: guidanceOutput.next_step, 
        language 
    });

    // 5. Combine outputs into a final structured JSON response
    // Ensuring fallback structure exists to prevent UI crashes if AI hallucinates
    const finalResponse = {
      next_step: guidanceOutput.next_step || 'Awaiting Next Step',
      timeline: Array.isArray(timelineOutput.timeline) ? timelineOutput.timeline : [],
      explanation: guidanceOutput.explanation || 'No explanation provided.'
    };
    
    // Save to cache
    journeyCache.set(cacheKey, finalResponse);

    // 6. Log to Firestore (Google Services Integration)
    // Runs asynchronously so it doesn't block the API response
    if (db) {
      db.collection('journeys').add({
        userId: req.user ? req.user.uid : 'anonymous',
        age: parsedAge,
        location,
        firstTimeVoter,
        timestamp: new Date(),
        nextStep: finalResponse.next_step
      }).catch(err => console.error('Firestore log error:', err));
    }

    // 7. Return response
    return sendSuccess(res, finalResponse);
  } catch (error) {
    console.error('Journey generation error:', error);
    next(error); // Passes to global error handler
  }
};

module.exports = {
    generateJourney,
    journeyCache
};
