const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  documentIds: [{ type: String, required: true }],
  status: { type: String, enum: ['processing', 'completed', 'failed'], default: 'completed' },
  totalFindings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
