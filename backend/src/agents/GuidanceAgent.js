const { ai } = require('../services/gemini.service');
const { extractJSON } = require('../utils/json');

class GuidanceAgent {
  /**
   * Generates a personalized voting journey next step and explanation.
   * Ensures output is strictly in JSON format.
   * @param {Object} userData { age, location, firstTimeVoter, language }
   * @returns {Object} { next_step, explanation }
   */
  async determineNextStep(userData) {
    const { age, location, firstTimeVoter, language = 'English' } = userData;
    
    // Explicit system instructions for JSON output
    const prompt = `You are an expert election guidance assistant. Based on the user's details, determine their exact next step in the election process.
User Details:
- Age: ${age}
- Location (State/City): ${location}
- First Time Voter: ${firstTimeVoter ? 'Yes' : 'No'}

Respond STRICTLY in JSON format with exactly these two keys:
1. "next_step": A short, actionable sentence (e.g., "Register to vote online").
2. "explanation": A clear, beginner-friendly explanation of why they need to do this and how it works.

If the user is under 18, the next step should be about pre-registration or learning about civics, and the explanation should clearly state they are not yet eligible to vote but can prepare.
Respond in the ${language} language. Return ONLY the JSON object, with no markdown formatting or extra text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return extractJSON(response.text);
    } catch (error) {
      console.error('GuidanceAgent Error:', error);
      throw new Error('Failed to determine next step.');
    }
  }
}

module.exports = new GuidanceAgent();
