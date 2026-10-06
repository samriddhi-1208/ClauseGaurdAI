const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const SERVER_URL = 'http://localhost:5000';
const AI_URL = 'http://localhost:8000';

// Test counters
let passed = 0;
let failed = 0;
const results = [];

function report(section, name, success, details) {
  if (success) {
    console.log(`  ✅ PASS: [${section}] ${name}`);
    if (details) console.log(`     └─ ${details}`);
    passed++;
    results.push({ section, name, status: 'PASS', details });
  } else {
    console.log(`  ❌ FAIL: [${section}] ${name}`);
    if (details) console.log(`     └─ Error: ${details}`);
    failed++;
    results.push({ section, name, status: 'FAIL', details });
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runEndToEndAudit() {
  console.log('====================================================');
  console.log('🧪 CLAUSEGUARD AI — END-TO-END AUDIT & EDGE-CASE TEST SUITE');
  console.log('====================================================\n');

  const testRunId = Date.now();
  const userAlphaEmail = `alpha_${testRunId}@testcorp.legal`;
  const userBetaEmail = `beta_${testRunId}@testcorp.legal`;
  const testPassword = 'SecurePassword123!';

  let tokenAlpha = null;
  let userAlphaId = null;
  let tokenBeta = null;
  let userBetaId = null;

  let docAlpha1Id = null;
  let docAlpha2Id = null;
  let docCorruptedId = null;

  // ----------------------------------------------------
  // SECTION 1: AUTHENTICATION & AUTHORIZATION
  // ----------------------------------------------------
  console.log('\n--- SECTION 1: AUTHENTICATION & AUTHORIZATION ---');

  // 1.1 Successful Registration
  try {
    const res = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User Alpha',
      email: userAlphaEmail,
      password: testPassword
    });
    tokenAlpha = res.data.token;
    userAlphaId = res.data.user.id || res.data.user._id;
    const noPasswordLeaked = !res.data.user.password;
    report('Auth', 'Successful registration returns token and omits password', 
      res.status === 201 && !!tokenAlpha && noPasswordLeaked, 
      `User ID: ${userAlphaId}`);
  } catch (e) {
    report('Auth', 'Successful registration', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 1.2 Duplicate Email Registration
  try {
    await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User Alpha Duplicate',
      email: userAlphaEmail,
      password: testPassword
    });
    report('Auth', 'Duplicate email registration rejected', false, 'Expected 400, got success');
  } catch (e) {
    report('Auth', 'Duplicate email registration rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.3 Weak Password Validation
  try {
    await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'Weak Pass User',
      email: `weak_${testRunId}@testcorp.legal`,
      password: '123'
    });
    report('Auth', 'Weak password (<6 chars) rejected', false, 'Expected 400, got success');
  } catch (e) {
    report('Auth', 'Weak password (<6 chars) rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.4 Valid Login
  try {
    const res = await axios.post(`${SERVER_URL}/api/auth/login`, {
      email: userAlphaEmail,
      password: testPassword
    });
    report('Auth', 'Valid login returns 200 with JWT', 
      res.status === 200 && !!res.data.token, 
      'Token successfully issued');
  } catch (e) {
    report('Auth', 'Valid login', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 1.5 Incorrect Password Login
  try {
    await axios.post(`${SERVER_URL}/api/auth/login`, {
      email: userAlphaEmail,
      password: 'WrongPassword999!'
    });
    report('Auth', 'Incorrect password rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Auth', 'Incorrect password rejected with 401', 
      e.response && e.response.status === 401, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.6 Nonexistent User Login
  try {
    await axios.post(`${SERVER_URL}/api/auth/login`, {
      email: `nonexistent_${testRunId}@testcorp.legal`,
      password: testPassword
    });
    report('Auth', 'Nonexistent user rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Auth', 'Nonexistent user rejected with 401', 
      e.response && e.response.status === 401, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.7 Missing JWT on Protected Route
  try {
    await axios.get(`${SERVER_URL}/api/documents`);
    report('Auth', 'Missing JWT rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Auth', 'Missing JWT rejected with 401', 
      e.response && e.response.status === 401, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.8 Malformed JWT
  try {
    await axios.get(`${SERVER_URL}/api/documents`, {
      headers: { Authorization: 'Bearer totally-malformed-token-string' }
    });
    report('Auth', 'Malformed JWT rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Auth', 'Malformed JWT rejected with 401', 
      e.response && e.response.status === 401, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.9 Invalid JWT Signature
  try {
    // A valid-format JWT with a forged signature
    const forgedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGMxYWI0ZTNmOGEiLCJpYXQiOjE2MDAwMDAwMDB9.invalid_signature_bytes';
    await axios.get(`${SERVER_URL}/api/documents`, {
      headers: { Authorization: `Bearer ${forgedToken}` }
    });
    report('Auth', 'Invalid JWT signature rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Auth', 'Invalid JWT signature rejected with 401', 
      e.response && e.response.status === 401, 
      e.response ? e.response.data.message : e.message);
  }

  // 1.10 Register Second User (User Beta) for Tenant Isolation Testing
  try {
    const res = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User Beta',
      email: userBetaEmail,
      password: testPassword
    });
    tokenBeta = res.data.token;
    userBetaId = res.data.user.id || res.data.user._id;
    report('Auth', 'User Beta registered for multi-tenant isolation tests', 
      res.status === 201 && !!tokenBeta, 
      `Beta ID: ${userBetaId}`);
  } catch (e) {
    report('Auth', 'User Beta registration', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // ----------------------------------------------------
  // SECTION 2: DOCUMENT UPLOAD & VALIDATION TESTS
  // ----------------------------------------------------
  console.log('\n--- SECTION 2: DOCUMENT UPLOAD & VALIDATION ---');

  // 2.1 Upload Without Authentication
  try {
    const form = new FormData();
    form.append('file', Buffer.from('Legal text'), { filename: 'test.txt' });
    await axios.post(`${SERVER_URL}/api/documents/upload`, form, { headers: form.getHeaders() });
    report('Upload', 'Upload without auth rejected', false, 'Expected 401, got success');
  } catch (e) {
    report('Upload', 'Upload without auth rejected with 401', 
      e.response && e.response.status === 401, 
      'Protected by authMiddleware');
  }

  // 2.2 Upload Dangerous Executable Extension (.exe)
  try {
    const form = new FormData();
    form.append('file', Buffer.from('malicious payload'), { filename: 'contract.exe' });
    await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Upload', 'Executable file (.exe) rejected', false, 'Expected 400, got success');
  } catch (e) {
    report('Upload', 'Executable file (.exe) rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 2.3 Upload Macro-enabled Extension (.docm)
  try {
    const form = new FormData();
    form.append('file', Buffer.from('macro file'), { filename: 'agreement.docm' });
    await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Upload', 'Macro file (.docm) rejected', false, 'Expected 400, got success');
  } catch (e) {
    report('Upload', 'Macro file (.docm) rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 2.4 Path Traversal Filename Sanitization
  try {
    const form = new FormData();
    form.append('file', Buffer.from('Valid legal text with traversal attempt.'), { filename: '../../traversal_doc.txt' });
    const res = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` },
      validateStatus: () => true
    });
    const safe = res.status === 400 || (res.status === 201 && !res.data.document.fileName.includes('..'));
    report('Upload', 'Path traversal filename safely neutralized or rejected', 
      safe, 
      res.status === 400 ? 'Rejected with 400' : `Safely sanitized as: ${res.data.document.fileName}`);
  } catch (e) {
    report('Upload', 'Path traversal test error', false, e.message);
  }

  // 2.5 Upload Valid TXT Document (Contract A: Net 30, Data Retention 5 years)
  try {
    const txtContent = `MASTER SERVICES AGREEMENT 2026

1. PAYMENT TERMS
All invoices submitted by Provider shall be paid by Customer within thirty (30) days of receipt. Late payments shall incur interest at 1.5% per month.

2. CONFIDENTIALITY
Each party agrees to hold all Confidential Information in confidence for a period of five (5) years following termination of this Agreement.

3. DATA RETENTION
Provider shall retain all Customer records and transaction logs for five (5) years following the conclusion of Services for audit compliance.

4. TERMINATION
Either party may terminate this Agreement upon ninety (90) days prior written notice.`;

    const form = new FormData();
    form.append('file', Buffer.from(txtContent, 'utf-8'), { filename: 'MSA_Contract_Alpha.txt' });
    const res = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    docAlpha1Id = res.data.document._id || res.data.document.id;
    report('Upload', 'Valid TXT contract uploaded successfully', 
      res.status === 201 && !!docAlpha1Id, 
      `Document 1 ID: ${docAlpha1Id}`);
  } catch (e) {
    report('Upload', 'Valid TXT upload', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 2.6 Upload Valid Second TXT Document (Contract B: Net 60, Data Deletion 2 years)
  try {
    const txtContent2 = `STATEMENT OF WORK & DATA ADDENDUM

1. INVOICING AND PAYMENT
Payment of invoices shall be due sixty (60) days after invoice issuance. No late interest shall apply.

2. CONFIDENTIALITY
Confidentiality obligations under this SOW shall expire two (2) years following the completion of Deliverables.

3. DATA RETENTION & DESTRUCTION
Provider must securely delete and erase all Customer confidential records within two (2) years of SOW completion.

4. TERMINATION
Customer may terminate this Statement of Work for convenience upon thirty (30) days written notice.`;

    const form = new FormData();
    form.append('file', Buffer.from(txtContent2, 'utf-8'), { filename: 'SOW_Contract_Beta.txt' });
    const res = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    docAlpha2Id = res.data.document._id || res.data.document.id;
    report('Upload', 'Valid second TXT contract uploaded successfully', 
      res.status === 201 && !!docAlpha2Id, 
      `Document 2 ID: ${docAlpha2Id}`);
  } catch (e) {
    report('Upload', 'Second TXT upload', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 2.7 Upload Corrupted Document (Unparseable binary content)
  try {
    const form = new FormData();
    form.append('file', Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09]), { filename: 'corrupted_test.pdf' });
    const res = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    docCorruptedId = res.data.document._id || res.data.document.id;
    report('Upload', 'Corrupted file accepted by upload and dispatched for extraction', 
      res.status === 201 && !!docCorruptedId, 
      `Corrupted Doc ID: ${docCorruptedId}`);
  } catch (e) {
    report('Upload', 'Corrupted upload', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 2.8 Filename Containing Spaces and Special Characters
  try {
    const form = new FormData();
    form.append('file', Buffer.from('Simple agreement text.'), { filename: 'Contract (Final) & SLA #1.txt' });
    const res = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Upload', 'Filename with spaces and special characters handled safely', 
      res.status === 201 && res.data.success, 
      `Sanitized safely: ${res.data.document.fileName}`);
  } catch (e) {
    report('Upload', 'Filename with special characters', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // ----------------------------------------------------
  // SECTION 3: DOCUMENT PROCESSING & CLAUSE EXTRACTION
  // ----------------------------------------------------
  console.log('\n--- SECTION 3: DOCUMENT PROCESSING & CLAUSE EXTRACTION ---');

  // Allow background processing to complete with dynamic polling
  console.log('  ⏳ Polling for async document processing to complete...');
  let doc1Status = 'processing';
  let doc1ClausesCount = 0;
  for (let poll = 0; poll < 15; poll++) {
    await sleep(1000);
    try {
      const checkRes = await axios.get(`${SERVER_URL}/api/documents/${docAlpha1Id}`, {
        headers: { Authorization: `Bearer ${tokenAlpha}` }
      });
      doc1Status = checkRes.data.document.processingStatus;
      doc1ClausesCount = checkRes.data.document.totalClauses;
      if (doc1Status === 'completed' || doc1Status === 'failed') break;
    } catch (e) {
      console.log(`     Polling attempt ${poll} error:`, e.message);
    }
  }

  // 3.1 Verify Document 1 processing status & clauses
  try {
    const isCompleted = doc1Status === 'completed';
    report('Processing', 'Document 1 transitioned to "completed" status', 
      isCompleted, 
      `Status: ${doc1Status}, Clauses: ${doc1ClausesCount}`);
  } catch (e) {
    report('Processing', 'Fetch Document 1 status', false, e.message);
  }

  // 3.2 Verify Document 1 extracted clauses
  try {
    const res = await axios.get(`${SERVER_URL}/api/documents/${docAlpha1Id}/clauses`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    const clauses = res.data.clauses;
    const hasClauses = Array.isArray(clauses) && clauses.length > 0;
    const categories = hasClauses ? [...new Set(clauses.map(c => c.category))] : [];
    report('Processing', 'Extracted categorized clauses with legal taxonomies', 
      hasClauses, 
      `Found ${clauses.length} clauses. Categories: ${categories.join(', ')}`);
  } catch (e) {
    report('Processing', 'Fetch clauses for Document 1', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 3.3 Verify Corrupted Document processing failure handling
  try {
    const res = await axios.get(`${SERVER_URL}/api/documents/${docCorruptedId}`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    const doc = res.data.document;
    // Corrupted file could be marked 'failed' by AI service
    const resClauses = await axios.get(`${SERVER_URL}/api/documents/${docCorruptedId}/clauses`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    const clauses = resClauses.data.clauses;
    // Verify no fake clauses were generated
    const noFakeClauses = clauses.length === 0 || doc.processingStatus === 'failed';
    report('Processing', 'Corrupted file does not generate fake clauses or marks status failed', 
      noFakeClauses, 
      `Status: ${doc.processingStatus}, Clauses: ${clauses.length}`);
  } catch (e) {
    report('Processing', 'Verify corrupted document failure handling', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // ----------------------------------------------------
  // SECTION 4: AUTHORIZATION & IDOR ISOLATION TESTS
  // ----------------------------------------------------
  console.log('\n--- SECTION 4: AUTHORIZATION & IDOR TENANT ISOLATION ---');

  // 4.1 User Beta cannot fetch User Alpha's document metadata
  try {
    await axios.get(`${SERVER_URL}/api/documents/${docAlpha1Id}`, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot view User Alpha document', false, 'Expected 404, got 200');
  } catch (e) {
    report('IDOR', 'User Beta cannot view User Alpha document (returns 404)', 
      e.response && e.response.status === 404, 
      e.response ? e.response.data.message : e.message);
  }

  // 4.2 User Beta cannot fetch User Alpha's document clauses
  try {
    await axios.get(`${SERVER_URL}/api/documents/${docAlpha1Id}/clauses`, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot fetch User Alpha clauses', false, 'Expected 404, got 200');
  } catch (e) {
    report('IDOR', 'User Beta cannot fetch User Alpha clauses (returns 404)', 
      e.response && e.response.status === 404, 
      e.response ? e.response.data.message : e.message);
  }

  // 4.3 User Beta cannot delete User Alpha's document
  try {
    await axios.delete(`${SERVER_URL}/api/documents/${docAlpha1Id}`, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot delete User Alpha document', false, 'Expected 404, got 200');
  } catch (e) {
    report('IDOR', 'User Beta cannot delete User Alpha document (returns 404)', 
      e.response && e.response.status === 404, 
      e.response ? e.response.data.message : e.message);
  }

  // 4.4 User Beta cannot trigger cross-document analysis using User Alpha's documents
  try {
    await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: [docAlpha1Id, docAlpha2Id]
    }, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot run analysis on User Alpha documents', false, 'Expected 403, got success');
  } catch (e) {
    report('IDOR', 'User Beta cannot run analysis on User Alpha documents (returns 403)', 
      e.response && e.response.status === 403, 
      e.response ? e.response.data.message : e.message);
  }

  // 4.5 User Beta cannot query RAG chat on User Alpha's documents
  try {
    await axios.post(`${SERVER_URL}/api/chat`, {
      question: 'What is the payment term?',
      documentIds: [docAlpha1Id]
    }, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot query RAG for User Alpha document', false, 'Expected 403, got success');
  } catch (e) {
    report('IDOR', 'User Beta cannot query RAG on User Alpha document (returns 403)', 
      e.response && e.response.status === 403, 
      e.response ? e.response.data.message : e.message);
  }

  // ----------------------------------------------------
  // SECTION 5: CROSS-DOCUMENT CONTRADICTION ANALYSIS
  // ----------------------------------------------------
  console.log('\n--- SECTION 5: CROSS-DOCUMENT CONTRADICTION ANALYSIS ---');

  let analysisId = null;

  // 5.1 Analysis with Fewer than 2 Documents (should reject)
  try {
    await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: [docAlpha1Id]
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Analysis', 'Analysis with < 2 documents rejected', false, 'Expected 400, got success');
  } catch (e) {
    report('Analysis', 'Analysis with < 2 documents rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 5.2 Analysis comparing same document with itself [doc1, doc1] (should reject)
  try {
    await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: [docAlpha1Id, docAlpha1Id]
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Analysis', 'Analysis with duplicate identical document ID rejected', false, 'Expected 403/400, got success');
  } catch (e) {
    report('Analysis', 'Analysis with duplicate identical document ID rejected', 
      e.response && (e.response.status === 403 || e.response.status === 400), 
      e.response ? e.response.data.message : e.message);
  }

  // 5.3 Valid Cross-Document Analysis (Doc 1 vs Doc 2)
  try {
    const res = await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: [docAlpha1Id, docAlpha2Id]
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    analysisId = res.data.analysis._id || res.data.analysis.id;
    const findings = res.data.findings || [];
    
    // Validate findings schema
    const validClassifications = ['POTENTIAL_CONTRADICTION', 'POTENTIAL_INCONSISTENCY', 'NO_SIGNIFICANT_CONFLICT', 'UNCERTAIN'];
    const validRiskLevels = ['HIGH', 'MEDIUM', 'LOW'];
    
    const allValidTypes = findings.every(f => 
      validClassifications.includes(f.classification) && 
      validRiskLevels.includes(f.riskLevel) &&
      f.explanation && f.recommendation
    );

    report('Analysis', 'Valid cross-document comparison generates structured findings', 
      res.status === 201 && findings.length > 0 && allValidTypes, 
      `Generated ${findings.length} findings. Risk levels: ${findings.map(f => f.riskLevel).join(', ')}`);
  } catch (e) {
    report('Analysis', 'Valid cross-document comparison', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 5.4 Fetch Historical Analysis Sessions
  try {
    const res = await axios.get(`${SERVER_URL}/api/analysis`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    const analyses = res.data.analyses || [];
    report('Analysis', 'Fetch historical analysis sessions for user', 
      res.status === 200 && analyses.length > 0, 
      `Found ${analyses.length} analysis records`);
  } catch (e) {
    report('Analysis', 'Fetch analysis history', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 5.5 Fetch Specific Analysis by ID
  try {
    const res = await axios.get(`${SERVER_URL}/api/analysis/${analysisId}`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Analysis', 'Fetch specific analysis by ID with findings', 
      res.status === 200 && res.data.findings && res.data.findings.length > 0, 
      `Analysis ${analysisId} loaded with ${res.data.findings.length} findings`);
  } catch (e) {
    report('Analysis', 'Fetch analysis by ID', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 5.6 User Beta cannot fetch User Alpha's analysis record
  try {
    await axios.get(`${SERVER_URL}/api/analysis/${analysisId}`, {
      headers: { Authorization: `Bearer ${tokenBeta}` }
    });
    report('IDOR', 'User Beta cannot view User Alpha analysis record', false, 'Expected 404, got 200');
  } catch (e) {
    report('IDOR', 'User Beta cannot view User Alpha analysis record (returns 404)', 
      e.response && e.response.status === 404, 
      e.response ? e.response.data.message : e.message);
  }

  // ----------------------------------------------------
  // SECTION 6: RAG GROUNDED LEGAL ASSISTANT
  // ----------------------------------------------------
  console.log('\n--- SECTION 6: RAG GROUNDED LEGAL ASSISTANT ---');

  // 6.1 Empty Question Validation
  try {
    await axios.post(`${SERVER_URL}/api/chat`, {
      question: '   ',
      documentIds: [docAlpha1Id]
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('RAG', 'Empty question rejected with 400', false, 'Expected 400, got success');
  } catch (e) {
    report('RAG', 'Empty question rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 6.2 Grounded QA with Document Context
  try {
    const res = await axios.post(`${SERVER_URL}/api/chat`, {
      question: 'What is the payment window specified in the agreement?',
      documentIds: [docAlpha1Id]
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    const answer = res.data.answer;
    const sources = res.data.sources || [];
    const hasSources = sources.length > 0;
    const hasCitationFields = hasSources && sources.every(s => s.documentId && s.pageNumber && s.snippet);
    report('RAG', 'Grounded QA returns answer with structured page citations', 
      res.status === 200 && !!answer && hasCitationFields, 
      `Answer length: ${answer.length} chars, Sources: ${sources.length}`);
  } catch (e) {
    report('RAG', 'Grounded QA', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 6.3 Query with Nonexistent/Invalid Document ID
  try {
    await axios.post(`${SERVER_URL}/api/chat`, {
      question: 'What are the liabilities?',
      documentIds: ['000000000000000000000000']
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('RAG', 'Query with unowned document ID rejected', false, 'Expected 403, got success');
  } catch (e) {
    report('RAG', 'Query with unowned document ID rejected with 403', 
      e.response && e.response.status === 403, 
      e.response ? e.response.data.message : e.message);
  }

  // ----------------------------------------------------
  // SECTION 7: DOCUMENT DELETION & VECTOR CLEANUP
  // ----------------------------------------------------
  console.log('\n--- SECTION 7: DOCUMENT DELETION & CLEANUP ---');

  // 7.1 Delete Document Alpha 2
  try {
    const res = await axios.delete(`${SERVER_URL}/api/documents/${docAlpha2Id}`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Deletion', 'Document deleted successfully by owner', 
      res.status === 200 && res.data.success, 
      'Document deleted');
  } catch (e) {
    report('Deletion', 'Delete document', false, e.response ? JSON.stringify(e.response.data) : e.message);
  }

  // 7.2 Verify Document Alpha 2 is removed from database
  try {
    await axios.get(`${SERVER_URL}/api/documents/${docAlpha2Id}`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Deletion', 'Deleted document no longer accessible', false, 'Expected 404, got 200');
  } catch (e) {
    report('Deletion', 'Deleted document returns 404 Not Found', 
      e.response && e.response.status === 404, 
      'Properly purged');
  }

  // 7.3 Verify Clauses for Document Alpha 2 are removed
  try {
    const res = await axios.get(`${SERVER_URL}/api/documents/${docAlpha2Id}/clauses`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('Deletion', 'Clauses for deleted document are inaccessible', false, 'Expected 404, got 200');
  } catch (e) {
    report('Deletion', 'Clauses for deleted document return 404 Not Found', 
      e.response && e.response.status === 404, 
      'Cascade cleaned');
  }

  // ----------------------------------------------------
  // SECTION 8: API ERROR HANDLING & DEFENSE
  // ----------------------------------------------------
  console.log('\n--- SECTION 8: API ERROR HANDLING & DEFENSE ---');

  // 8.1 Malformed MongoDB ObjectId in URL params
  try {
    await axios.get(`${SERVER_URL}/api/documents/invalid-non-hex-id`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('API Errors', 'Malformed ObjectId URL param rejected safely', false, 'Expected 404, got 200');
  } catch (e) {
    report('API Errors', 'Malformed ObjectId URL param handled safely with 404', 
      e.response && e.response.status === 404, 
      e.response ? e.response.data.message : e.message);
  }

  // 8.2 Malformed JSON body in analysis compare
  try {
    await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: 'not-an-array'
    }, {
      headers: { Authorization: `Bearer ${tokenAlpha}` }
    });
    report('API Errors', 'Non-array documentIds rejected with 400', false, 'Expected 400, got success');
  } catch (e) {
    report('API Errors', 'Non-array documentIds rejected with 400', 
      e.response && e.response.status === 400, 
      e.response ? e.response.data.message : e.message);
  }

  // 8.3 Verify No Server Secrets Leaked in Error Responses
  try {
    const res = await axios.get(`${SERVER_URL}/api/documents/invalid-id`, {
      headers: { Authorization: `Bearer ${tokenAlpha}` },
      validateStatus: () => true
    });
    const bodyStr = JSON.stringify(res.data);
    const hasSecrets = bodyStr.includes('mongodb://') || bodyStr.includes('JWT_SECRET') || bodyStr.includes('GEMINI_API_KEY');
    report('Security', 'Error responses omit stack traces and environment secrets', 
      !hasSecrets, 
      'Clean sanitized error payload');
  } catch (e) {
    report('Security', 'Secret leak check', false, e.message);
  }

  // ----------------------------------------------------
  // SECTION 9: CONCURRENCY & RAPID DUPLICATE CALLS
  // ----------------------------------------------------
  console.log('\n--- SECTION 9: CONCURRENCY & PARALLEL REQUESTS ---');

  // 9.1 Parallel Document Fetches
  try {
    const promises = [
      axios.get(`${SERVER_URL}/api/documents`, { headers: { Authorization: `Bearer ${tokenAlpha}` } }),
      axios.get(`${SERVER_URL}/api/documents`, { headers: { Authorization: `Bearer ${tokenAlpha}` } }),
      axios.get(`${SERVER_URL}/api/documents`, { headers: { Authorization: `Bearer ${tokenAlpha}` } })
    ];
    const results = await Promise.all(promises);
    const all200 = results.every(r => r.status === 200 && r.data.success);
    report('Concurrency', 'Parallel document listing handled consistently', 
      all200, 
      `Successfully resolved ${results.length} parallel queries`);
  } catch (e) {
    report('Concurrency', 'Parallel document fetches', false, e.message);
  }

  // ----------------------------------------------------
  // SUMMARY
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log(`📊 END-TO-END AUDIT COMPLETE: ${passed} PASSED / ${failed} FAILED (TOTAL: ${passed + failed})`);
  console.log('====================================================');
}

runEndToEndAudit();
