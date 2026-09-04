const Document = require('../models/Document');
const Clause = require('../models/Clause');
const Analysis = require('../models/Analysis');
const Contradiction = require('../models/Contradiction');
const { db, saveData } = require('../storage/store');
const { compareDocumentsWithAI } = require('../services/aiService');

exports.seedDemoData = async (req, res) => {
  try {
    const userId = req.user.id;

    const docA_Data = {
      fileName: 'Sample_Contract_A_Enterprise.pdf',
      filePath: 'uploads/sample_contract_a.pdf',
      fileSize: 45200,
      processingStatus: 'completed',
      totalPages: 4,
      totalClauses: 2
    };

    const docB_Data = {
      fileName: 'Sample_Contract_B_Vendor.pdf',
      filePath: 'uploads/sample_contract_b.pdf',
      fileSize: 38900,
      processingStatus: 'completed',
      totalPages: 3,
      totalClauses: 2
    };

    let docA_id, docB_id;

    if (global.isMongoConnected) {
      const docA = await Document.create({ ...docA_Data, userId });
      const docB = await Document.create({ ...docB_Data, userId });
      docA_id = docA._id.toString();
      docB_id = docB._id.toString();

      await Clause.insertMany([
        {
          userId,
          documentId: docA_id,
          category: 'DATA_RETENTION',
          content: 'Customer data must be retained for 5 years from contract termination.',
          pageNumber: 2,
          confidence: 0.96
        },
        {
          userId,
          documentId: docA_id,
          category: 'PAYMENT',
          content: 'Payment must be completed within 30 days of invoice issuance.',
          pageNumber: 1,
          confidence: 0.94
        },
        {
          userId,
          documentId: docB_id,
          category: 'DATA_RETENTION',
          content: 'Customer data must be permanently deleted after 2 years.',
          pageNumber: 3,
          confidence: 0.95
        },
        {
          userId,
          documentId: docB_id,
          category: 'PAYMENT',
          content: 'Payment must be completed within 60 days of invoice receipt.',
          pageNumber: 1,
          confidence: 0.91
        }
      ]);
    } else {
      docA_id = `demo_docA_${Date.now()}`;
      docB_id = `demo_docB_${Date.now()}`;

      db.documents.push({ _id: docA_id, id: docA_id, userId, ...docA_Data, uploadDate: new Date().toISOString() });
      db.documents.push({ _id: docB_id, id: docB_id, userId, ...docB_Data, uploadDate: new Date().toISOString() });

      db.clauses.push(
        { _id: `c1_${Date.now()}`, userId, documentId: docA_id, category: 'DATA_RETENTION', content: 'Customer data must be retained for 5 years from contract termination.', pageNumber: 2, confidence: 0.96 },
        { _id: `c2_${Date.now()}`, userId, documentId: docA_id, category: 'PAYMENT', content: 'Payment must be completed within 30 days of invoice issuance.', pageNumber: 1, confidence: 0.94 },
        { _id: `c3_${Date.now()}`, userId, documentId: docB_id, category: 'DATA_RETENTION', content: 'Customer data must be permanently deleted after 2 years.', pageNumber: 3, confidence: 0.95 },
        { _id: `c4_${Date.now()}`, userId, documentId: docB_id, category: 'PAYMENT', content: 'Payment must be completed within 60 days of invoice receipt.', pageNumber: 1, confidence: 0.91 }
      );
      saveData();
    }

    // Run instant contradiction analysis for demo
    const clausesPayload = [
      { documentId: docA_id, documentName: docA_Data.fileName, category: 'DATA_RETENTION', content: 'Customer data must be retained for 5 years from contract termination.', pageNumber: 2 },
      { documentId: docA_id, documentName: docA_Data.fileName, category: 'PAYMENT', content: 'Payment must be completed within 30 days of invoice issuance.', pageNumber: 1 },
      { documentId: docB_id, documentName: docB_Data.fileName, category: 'DATA_RETENTION', content: 'Customer data must be permanently deleted after 2 years.', pageNumber: 3 },
      { documentId: docB_id, documentName: docB_Data.fileName, category: 'PAYMENT', content: 'Payment must be completed within 60 days of invoice receipt.', pageNumber: 1 }
    ];

    const aiRes = await compareDocumentsWithAI(userId, [docA_id, docB_id], clausesPayload);
    const findings = aiRes.findings || [];

    let analysisId;

    if (global.isMongoConnected) {
      const analysis = await Analysis.create({
        userId,
        documentIds: [docA_id, docB_id],
        status: 'completed',
        totalFindings: findings.length
      });
      analysisId = analysis._id.toString();

      await Contradiction.insertMany(findings.map(f => ({
        userId,
        analysisId,
        documentA: f.documentA,
        documentB: f.documentB,
        clauseA: f.clauseA,
        clauseB: f.clauseB,
        category: f.category,
        classification: f.classification,
        riskLevel: f.riskLevel,
        confidence: f.confidence || 0.95,
        explanation: f.explanation,
        recommendation: f.recommendation
      })));
    } else {
      analysisId = `demo_analysis_${Date.now()}`;
      db.analyses.push({
        _id: analysisId,
        id: analysisId,
        userId,
        documentIds: [docA_id, docB_id],
        status: 'completed',
        totalFindings: findings.length,
        createdAt: new Date().toISOString()
      });

      findings.forEach(f => {
        db.contradictions.push({
          _id: `demo_finding_${Date.now()}_${Math.random()}`,
          userId,
          analysisId,
          documentA: f.documentA,
          documentB: f.documentB,
          clauseA: f.clauseA,
          clauseB: f.clauseB,
          category: f.category,
          classification: f.classification,
          riskLevel: f.riskLevel,
          confidence: f.confidence || 0.95,
          explanation: f.explanation,
          recommendation: f.recommendation,
          createdAt: new Date().toISOString()
        });
      });
      saveData();
    }

    return res.status(201).json({
      success: true,
      message: 'Demo contracts loaded and contradiction analysis completed successfully.',
      analysisId,
      documentIds: [docA_id, docB_id]
    });
  } catch (error) {
    console.error('[Demo Seed Error]', error);
    return res.status(500).json({ success: false, message: 'Failed to populate demo contracts.' });
  }
};
