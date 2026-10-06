const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const Clause = require('../models/Clause');
const { processDocumentWithAI, deleteDocumentVectorsWithAI } = require('../services/aiService');
const { db, saveData } = require('../storage/store');

exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const userId = req.user.id;
    const { originalname, path: filePath, size } = req.file;

    let docRecord;

    if (global.isMongoConnected) {
      docRecord = await Document.create({
        userId,
        fileName: originalname,
        filePath,
        fileSize: size,
        processingStatus: 'processing'
      });
    } else {
      docRecord = {
        _id: `doc_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        userId,
        fileName: originalname,
        filePath,
        fileSize: size,
        uploadDate: new Date().toISOString(),
        processingStatus: 'processing',
        totalPages: 1,
        totalClauses: 0
      };
      db.documents.push(docRecord);
      saveData();
    }

    const docId = docRecord._id ? docRecord._id.toString() : docRecord.id;

    // Trigger async AI Processing
    processDocumentWithAI(userId, docId, originalname, filePath)
      .then(async (aiRes) => {
        const clausesToInsert = (aiRes.clauses || []).map(c => ({
          userId,
          documentId: docId,
          category: c.category,
          content: c.content,
          pageNumber: c.pageNumber || 1,
          confidence: c.confidence || 0.9,
          createdAt: new Date()
        }));

        if (global.isMongoConnected) {
          await Clause.insertMany(clausesToInsert);
          await Document.findByIdAndUpdate(docId, {
            processingStatus: 'completed',
            totalPages: aiRes.totalPages || 1,
            totalClauses: clausesToInsert.length
          });
        } else {
          db.clauses.push(...clausesToInsert.map(c => ({ ...c, _id: `cl_${Date.now()}_${Math.random()}` })));
          const targetDoc = db.documents.find(d => d._id === docId || d.id === docId);
          if (targetDoc) {
            targetDoc.processingStatus = 'completed';
            targetDoc.totalPages = aiRes.totalPages || 1;
            targetDoc.totalClauses = clausesToInsert.length;
          }
          saveData();
        }
      })
      .catch(async (err) => {
        console.error('[Document Processing Error]', err);
        if (global.isMongoConnected) {
          await Document.findByIdAndUpdate(docId, { processingStatus: 'failed' });
        } else {
          const targetDoc = db.documents.find(d => d._id === docId || d.id === docId);
          if (targetDoc) targetDoc.processingStatus = 'failed';
          saveData();
        }
      });

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully and processing started.',
      document: docRecord
    });
  } catch (error) {
    console.error('[Upload Document Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to upload document.' });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    if (global.isMongoConnected) {
      const documents = await Document.find({ userId }).sort({ uploadDate: -1 });
      return res.json({ success: true, documents });
    } else {
      const documents = db.documents.filter(d => d.userId === userId);
      return res.json({ success: true, documents });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch documents.' });
  }
};

exports.getDocumentById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (global.isMongoConnected) {
      const document = await Document.findOne({ _id: id, userId });
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      const clauses = await Clause.find({ documentId: id, userId });
      return res.json({ success: true, document, clauses });
    } else {
      const document = db.documents.find(d => (d._id === id || d.id === id) && d.userId === userId);
      if (!document) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      const clauses = db.clauses.filter(c => c.documentId === id && c.userId === userId);
      return res.json({ success: true, document, clauses });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
    }
    return res.status(500).json({ success: false, message: 'Failed to fetch document details.' });
  }
};

exports.getDocumentClauses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (global.isMongoConnected) {
      const doc = await Document.findOne({ _id: id, userId });
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      const clauses = await Clause.find({ documentId: id, userId });
      return res.json({ success: true, clauses });
    } else {
      const doc = db.documents.find(d => (d._id === id || d.id === id) && d.userId === userId);
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      const clauses = db.clauses.filter(c => c.documentId === id && c.userId === userId);
      return res.json({ success: true, clauses });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
    }
    return res.status(500).json({ success: false, message: 'Failed to fetch clauses.' });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (global.isMongoConnected) {
      const doc = await Document.findOneAndDelete({ _id: id, userId });
      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      await Clause.deleteMany({ documentId: id, userId });

      // Clean local file
      if (doc.filePath && fs.existsSync(doc.filePath)) {
        try { fs.unlinkSync(doc.filePath); } catch (e) {}
      }
    } else {
      const docIndex = db.documents.findIndex(d => (d._id === id || d.id === id) && d.userId === userId);
      if (docIndex === -1) {
        return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
      }
      const doc = db.documents[docIndex];
      db.documents.splice(docIndex, 1);
      db.clauses = db.clauses.filter(c => !(c.documentId === id && c.userId === userId));
      saveData();

      if (doc.filePath && fs.existsSync(doc.filePath)) {
        try { fs.unlinkSync(doc.filePath); } catch (e) {}
      }
    }

    // Notify AI service to delete vectors
    deleteDocumentVectorsWithAI(userId, id);

    return res.json({ success: true, message: 'Document and associated clauses deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Document not found or unauthorized.' });
    }
    return res.status(500).json({ success: false, message: 'Failed to delete document.' });
  }
};

