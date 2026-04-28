const { ai } = require('../services/gemini.service');
const { extractJSON } = require('../utils/json');

class TimelineAgent {
  /**
   * Generates relevant dates and deadlines based on location and the determined next step.
   * Ensures output is strictly in JSON format.
   * @param {Object} data { location, next_step, language }
   * @returns {Object} { timeline: [] }
   */
  async generateTimeline(data) {
    const { location, next_step, language = 'English' } = data;
    
    const prompt = `You are an expert election timeline assistant. Based on the user's location and their next actionable step, provide 2 to 3 key upcoming dates or generic deadlines they need to be aware of.
Location: ${location}
Next Step: ${next_step}

Respond STRICTLY in JSON format with exactly one key:
1. "timeline": An array of strings, where each string describes an important date or deadline (e.g. "Voter Registration Deadline: Oct 15", "Election Day: Nov 5"). If exact dates for the location are unknown, provide general timeframe guidance.

Respond in the ${language} language. Return ONLY the JSON object, with no markdown formatting or extra text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return extractJSON(response.text);
    } catch (error) {
      console.error('TimelineAgent Error:', error);
      throw new Error('Failed to generate timeline.');
    }
  }
}

module.exports = new TimelineAgent();
