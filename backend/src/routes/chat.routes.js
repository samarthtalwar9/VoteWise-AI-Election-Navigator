const express = require('express');
const router = express.Router();
const QueryAgent = require('../agents/QueryAgent');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', verifyToken, async (req, res, next) => {
  try {
    const { query, context, language } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Missing required field: query' });
    }

    const answerOutput = await QueryAgent.handleQuery({ query, context: context || {}, language });
    res.status(200).json(answerOutput);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
