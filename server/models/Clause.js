const mongoose = require('mongoose');

const clauseSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  documentId: { type: String, required: true, index: true },
  category: { 
    type: String, 
    enum: [
      'PAYMENT',
      'CONFIDENTIALITY',
      'TERMINATION',
      'LIABILITY',
      'DATA_PRIVACY',
      'DATA_RETENTION',
      'DATA_STORAGE',
      'JURISDICTION',
      'INTELLECTUAL_PROPERTY',
      'OTHER'
    ], 
    default: 'OTHER' 
  },
  content: { type: String, required: true },
  pageNumber: { type: Number, default: 1 },
  confidence: { type: Number, default: 0.9 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Clause', clauseSchema);
