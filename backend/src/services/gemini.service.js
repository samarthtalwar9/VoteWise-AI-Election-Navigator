const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

let realAi = null;
if (process.env.GEMINI_API_KEY) {
  realAi = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

// Wrapper to ensure fallback data is returned if Gemini fails (e.g., invalid key, rate limits)
const ai = {
  models: {
    generateContent: async (params) => {
      if (realAi) {
        try {
          const res = await realAi.models.generateContent(params);
          return res;
        } catch (err) {
          console.error("Gemini API Error (falling back to mock):", err.message);
          // Fall through to mock
        }
      } else {
        console.warn("GEMINI_API_KEY not set. Using mock.");
      }
      
      // Provide context-aware mocks based on prompt content
      const content = params.contents.toString().toLowerCase();
      let mockJson = {};
      
      if (content.includes("timeline")) {
        mockJson = { timeline: ["Nov 1 - Voter Registration Ends", "Nov 5 - Election Day"] };
      } else if (content.includes("answer")) {
        mockJson = { answer: "This is an AI-generated fallback answer because the Gemini API is currently unavailable." };
      } else {
        mockJson = {
          next_step: "Register to vote online",
          explanation: "This is a fallback step because the Gemini API is currently unavailable."
        };
      }
      
      return { text: JSON.stringify(mockJson) };
    }
  }
};

module.exports = { ai };
