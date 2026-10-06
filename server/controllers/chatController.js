const Document = require('../models/Document');
const { db } = require('../storage/store');
const { askRagChatWithAI } = require('../services/aiService');

exports.askChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { question, documentIds } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Question cannot be empty.' });
    }

    let scopedDocIds = undefined;
    if (documentIds && Array.isArray(documentIds) && documentIds.length > 0) {
      if (global.isMongoConnected) {
        const userDocs = await Document.find({ _id: { $in: documentIds }, userId }).select('_id');
        scopedDocIds = userDocs.map(d => d._id.toString());
      } else {
        const userDocs = db.documents.filter(d => documentIds.includes(d._id || d.id) && d.userId === userId);
        scopedDocIds = userDocs.map(d => (d._id || d.id).toString());
      }

      if (scopedDocIds.length === 0) {
        return res.status(403).json({ success: false, message: 'Unauthorized: None of the specified documents belong to your account.' });
      }
    }

    const response = await askRagChatWithAI(userId, question.trim(), scopedDocIds);

    return res.json({
      success: true,
      answer: response.answer,
      sources: response.sources || []
    });
  } catch (error) {
    console.error('[Chat Controller Error]', error.message || error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to process legal assistant query.'
    });
  }
};
