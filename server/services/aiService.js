const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

class AIServiceUnavailableError extends Error {
  constructor(message = 'AI service is currently unavailable. Please make sure the Python AI service is running and try again.') {
    super(message);
    this.name = 'AIServiceUnavailableError';
    this.statusCode = 503;
  }
}

async function processDocumentWithAI(userId, documentId, documentName, filePath) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/process-document`, {
      userId,
      documentId,
      documentName,
      filePath
    }, { timeout: 30000 });
    return res.data;
  } catch (error) {
    console.error('[AI Service] FastAPI unavailable: connection failed');
    throw new AIServiceUnavailableError();
  }
}

async function compareDocumentsWithAI(userId, documentIds, clauses) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/compare-documents`, {
      userId,
      documentIds,
      clauses
    }, { timeout: 45000 });
    return res.data;
  } catch (error) {
    console.error('[AI Service] FastAPI comparison endpoint unavailable: connection failed');
    throw new AIServiceUnavailableError();
  }
}

async function askRagChatWithAI(userId, question, documentIds) {
  try {
    const res = await axios.post(`${AI_SERVICE_URL}/rag-chat`, {
      userId,
      question,
      documentIds
    }, { timeout: 30000 });
    return res.data;
  } catch (error) {
    console.error('[AI Service] FastAPI RAG endpoint unavailable: connection failed');
    throw new AIServiceUnavailableError();
  }
}

async function deleteDocumentVectorsWithAI(userId, documentId) {
  try {
    await axios.delete(`${AI_SERVICE_URL}/documents/${userId}/${documentId}`, { timeout: 10000 });
  } catch (err) {
    console.warn('[AI Service] Vector delete notification failed: connection failed');
  }
}

module.exports = {
  AIServiceUnavailableError,
  processDocumentWithAI,
  compareDocumentsWithAI,
  askRagChatWithAI,
  deleteDocumentVectorsWithAI
};
