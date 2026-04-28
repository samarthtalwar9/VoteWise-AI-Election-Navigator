/**
 * Safely extracts JSON from a string that might contain markdown formatting
 * or leading/trailing text.
 */
function extractJSON(text) {
  try {
    // Attempt standard parse first
    return JSON.parse(text);
  } catch (e) {
    // If standard parse fails, try to extract from markdown blocks
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch (err) {
      // If that still fails, find the first '{' and last '}' or '[' and ']'
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      const firstBracket = cleanText.indexOf('[');
      const lastBracket = cleanText.lastIndexOf(']');
      
      let isObject = firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket);
      
      if (isObject) {
        return JSON.parse(cleanText.substring(firstBrace, lastBrace + 1));
      } else if (firstBracket !== -1 && lastBracket !== -1) {
        return JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
      }
      throw new Error('Failed to extract JSON from response: ' + text);
    }
  }
}

module.exports = { extractJSON };
