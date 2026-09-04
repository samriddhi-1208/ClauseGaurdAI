const { askRagChatWithAI } = require('../services/aiService');

exports.askChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { question, documentIds } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question cannot be empty.' });
    }

    const response = await askRagChatWithAI(userId, question.trim(), documentIds);

    return res.json({
      success: true,
      answer: response.answer,
      sources: response.sources || []
    });
  } catch (error) {
    console.error('[Chat Controller Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to process legal assistant query.' });
  }
};
