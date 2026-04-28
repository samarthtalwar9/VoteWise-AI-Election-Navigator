const QueryAgent = require('../agents/QueryAgent');
const { sendSuccess, sendError } = require('../utils/response.util');

/**
 * Controller to handle interactive chat queries about voting processes.
 */
const handleChatQuery = async (req, res, next) => {
  try {
    const { query, context, language } = req.body;

    if (!query || query.trim() === '') {
      return sendError(res, 'Missing required field: query', 400);
    }

    const answerOutput = await QueryAgent.handleQuery({ 
        query, 
        context: context || {}, 
        language 
    });

    // Ensure the response always contains an 'answer' field
    const finalResponse = {
        answer: answerOutput.answer || "I'm sorry, I couldn't generate an answer at this time. Please try rephrasing your question."
    };

    return sendSuccess(res, finalResponse);
  } catch (error) {
    console.error('Chat query error:', error);
    next(error);
  }
};

module.exports = {
    handleChatQuery
};
