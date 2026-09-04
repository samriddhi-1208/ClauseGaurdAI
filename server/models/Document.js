const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  processingStatus: { 
    type: String, 
    enum: ['uploaded', 'processing', 'completed', 'failed'], 
    default: 'uploaded' 
  },
  totalPages: { type: Number, default: 1 },
  totalClauses: { type: Number, default: 0 }
});

module.exports = mongoose.model('Document', documentSchema);
