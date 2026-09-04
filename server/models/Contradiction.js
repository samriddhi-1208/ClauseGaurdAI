const mongoose = require('mongoose');

const contradictionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  analysisId: { type: String, required: true, index: true },
  documentA: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  documentB: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  clauseA: {
    content: { type: String, required: true },
    pageNumber: { type: Number, default: 1 }
  },
  clauseB: {
    content: { type: String, required: true },
    pageNumber: { type: Number, default: 1 }
  },
  category: { type: String, required: true },
  classification: { 
    type: String, 
    enum: ['NO_SIGNIFICANT_CONFLICT', 'POTENTIAL_INCONSISTENCY', 'POTENTIAL_CONTRADICTION', 'UNCERTAIN'],
    required: true 
  },
  riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  confidence: { type: Number, default: 0.9 },
  explanation: { type: String, required: true },
  recommendation: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contradiction', contradictionSchema);
