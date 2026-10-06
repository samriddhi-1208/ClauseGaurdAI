const Analysis = require('../models/Analysis');
const Contradiction = require('../models/Contradiction');
const Clause = require('../models/Clause');
const Document = require('../models/Document');
const { compareDocumentsWithAI } = require('../services/aiService');
const { db, saveData } = require('../storage/store');

exports.compareDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentIds } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length < 2) {
      return res.status(400).json({ success: false, message: 'Select at least two documents for cross-document comparison.' });
    }

    let clauses = [];
    let docs = [];

    if (global.isMongoConnected) {
      clauses = await Clause.find({ documentId: { $in: documentIds }, userId });
      docs = await Document.find({ _id: { $in: documentIds }, userId });
    } else {
      clauses = db.clauses.filter(c => documentIds.includes(c.documentId) && c.userId === userId);
      docs = db.documents.filter(d => documentIds.includes(d._id || d.id) && d.userId === userId);
    }

    if (clauses.length === 0) {
      return res.status(400).json({ success: false, message: 'No clauses found in the selected documents for analysis.' });
    }

    // Attach document names to clause items
    const docMap = {};
    docs.forEach(d => {
      const id = d._id ? d._id.toString() : d.id;
      docMap[id] = d.fileName;
    });

    const clausePayload = clauses.map(c => ({
      documentId: c.documentId,
      documentName: docMap[c.documentId] || 'Document',
      category: c.category,
      content: c.content,
      pageNumber: c.pageNumber || 1
    }));

    // Trigger AI comparison
    const aiRes = await compareDocumentsWithAI(userId, documentIds, clausePayload);

    const findings = aiRes.findings || [];

    let analysisRecord;
    let savedFindings = [];

    if (global.isMongoConnected) {
      analysisRecord = await Analysis.create({
        userId,
        documentIds,
        status: 'completed',
        totalFindings: findings.length
      });

      const contradictionDocs = findings.map(f => ({
        userId,
        analysisId: analysisRecord._id.toString(),
        documentA: f.documentA,
        documentB: f.documentB,
        clauseA: f.clauseA,
        clauseB: f.clauseB,
        category: f.category,
        classification: f.classification,
        riskLevel: f.riskLevel,
        confidence: f.confidence || 0.9,
        explanation: f.explanation,
        recommendation: f.recommendation
      }));

      savedFindings = await Contradiction.insertMany(contradictionDocs);
    } else {
      analysisRecord = {
        _id: `analysis_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        userId,
        documentIds,
        status: 'completed',
        totalFindings: findings.length,
        createdAt: new Date().toISOString()
      };
      db.analyses.push(analysisRecord);

      savedFindings = findings.map(f => {
        const item = {
          _id: `finding_${Date.now()}_${Math.floor(Math.random()*1000)}`,
          userId,
          analysisId: analysisRecord._id,
          documentA: f.documentA,
          documentB: f.documentB,
          clauseA: f.clauseA,
          clauseB: f.clauseB,
          category: f.category,
          classification: f.classification,
          riskLevel: f.riskLevel,
          confidence: f.confidence || 0.9,
          explanation: f.explanation,
          recommendation: f.recommendation,
          createdAt: new Date().toISOString()
        };
        db.contradictions.push(item);
        return item;
      });

      saveData();
    }

    return res.status(201).json({
      success: true,
      analysis: analysisRecord,
      findings: savedFindings
    });
  } catch (error) {
    console.error('[Compare Documents Error]', error.message || error);
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to run cross-document analysis.'
    });
  }
};

exports.getAnalyses = async (req, res) => {
  try {
    const userId = req.user.id;
    if (global.isMongoConnected) {
      const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 });
      return res.json({ success: true, analyses });
    } else {
      const analyses = db.analyses.filter(a => a.userId === userId);
      return res.json({ success: true, analyses });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analyses.' });
  }
};

exports.getAnalysisById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (global.isMongoConnected) {
      const analysis = await Analysis.findOne({ _id: id, userId });
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Analysis not found.' });
      }
      const findings = await Contradiction.find({ analysisId: id, userId });
      return res.json({ success: true, analysis, findings });
    } else {
      const analysis = db.analyses.find(a => (a._id === id || a.id === id) && a.userId === userId);
      if (!analysis) {
        return res.status(404).json({ success: false, message: 'Analysis not found.' });
      }
      const findings = db.contradictions.filter(c => c.analysisId === id && c.userId === userId);
      return res.json({ success: true, analysis, findings });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analysis details.' });
  }
};
