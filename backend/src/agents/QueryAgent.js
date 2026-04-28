const { ai } = require('../services/gemini.service');
const { extractJSON } = require('../utils/json');

class QueryAgent {
  /**
   * Handles user queries about the election process with contextual reasoning.
   * Ensures output is strictly in JSON format.
   * @param {Object} data { query, context, language }
   * @returns {Object} { answer }
   */
  async handleQuery(data) {
    const { query, context, language = 'English' } = data;
    
    const prompt = `You are an expert, friendly election guidance assistant. Answer the user's question clearly and concisely.
User Question: "${query}"
User Context (Journey stage/Location/Age): ${JSON.stringify(context)}

Respond STRICTLY in JSON format with exactly one key:
1. "answer": Your helpful, beginner-friendly answer to the question.

Respond in the ${language} language. Return ONLY the JSON object, with no markdown formatting or extra text.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      return extractJSON(response.text);
    } catch (error) {
      console.error('QueryAgent Error:', error);
      throw new Error('Failed to answer query.');
    }
  }
}

module.exports = new QueryAgent();
