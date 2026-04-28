const { GoogleGenAI } = require('@google/genai');
const dotenv = require('dotenv');

dotenv.config();

let ai = null;

if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not set. The application will not be able to call the Gemini API.");
  // Provide a mock for testing if no key is set
  ai = {
    models: {
      generateContent: async () => ({
        text: JSON.stringify({
          next_step: "Mock Step",
          timeline: ["Mock Date 1", "Mock Date 2"],
          explanation: "This is a mock response because GEMINI_API_KEY is not set."
        })
      })
    }
  };
}

module.exports = { ai };
