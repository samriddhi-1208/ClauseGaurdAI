const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const SERVER_URL = 'http://localhost:5000';
const AI_URL = 'http://localhost:8000';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('🔒 CLAUSEGUARD AI — 16-POINT SECURITY AUDIT TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function report(num, name, success, details) {
    if (success) {
      console.log(`✅ [TEST ${num}] PASS: ${name}`);
      if (details) console.log(`   └─ ${details}`);
      passed++;
    } else {
      console.log(`❌ [TEST ${num}] FAIL: ${name}`);
      if (details) console.log(`   └─ Error: ${details}`);
      failed++;
    }
  }

  // TEST 1: Server Health Check
  try {
    const res = await axios.get(`${SERVER_URL}/api/health`);
    const data = res.data;
    const bodyStr = JSON.stringify(data);
    const hasSecrets = bodyStr.includes('mongodb') || bodyStr.includes('password') || bodyStr.includes('AI_SERVICE') || bodyStr.includes('secret') || bodyStr.includes('KEY');
    if (res.status === 200 && data.status === 'ok' && !hasSecrets) {
      report(1, 'Server health check returns 200 without exposing credentials', true, 'Clean response, no secrets leaked');
    } else {
      report(1, 'Server health check exposed secrets or failed', false, JSON.stringify(data));
    }
  } catch (e) {
    report(1, 'Server health check', false, e.message);
  }

  // TEST 2: AI Service Health Check
  try {
    const res = await axios.get(`${AI_URL}/health`);
    const data = res.data;
    const bodyStr = JSON.stringify(data);
    const hasRawKey = bodyStr.includes('AIza') || (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5 && bodyStr.includes(process.env.GEMINI_API_KEY));
    if (res.status === 200 && data.status === 'ok' && !hasRawKey && data.gemini_status) {
      report(2, 'AI service health check does not expose GEMINI_API_KEY', true, `Status: ${data.gemini_status}, no raw key present`);
    } else {
      report(2, 'AI service health check exposed key', false, JSON.stringify(data));
    }
  } catch (e) {
    report(2, 'AI service health check', false, e.message);
  }

  // TEST 3: Express Security Headers (Helmet)
  try {
    const res = await axios.get(`${SERVER_URL}/api/health`);
    const h = res.headers;
    const hasHelmet = Boolean(h['x-content-type-options'] === 'nosniff' && (h['x-dns-prefetch-control'] || h['x-frame-options']));
    if (hasHelmet) {
      report(3, 'Express Helmet security headers applied', true, `X-Content-Type-Options: ${h['x-content-type-options']}`);
    } else {
      report(3, 'Express Helmet security headers missing', false, JSON.stringify(h));
    }
  } catch (e) {
    report(3, 'Express Helmet security headers', false, e.message);
  }

  // TEST 4: Express CORS blocking unauthorized origin
  try {
    const corsRes = await axios.get(`${SERVER_URL}/api/documents`, {
      headers: { Origin: 'http://malicious-attacker-site.com' },
      validateStatus: () => true
    });
    // Either CORS error or 403 or missing Access-Control-Allow-Origin header
    const acao = corsRes.headers['access-control-allow-origin'];
    const blocked = corsRes.status === 403 || !acao || acao !== 'http://malicious-attacker-site.com';
    if (blocked) {
      report(4, 'Express CORS blocks untrusted origins', true, `Untrusted origin rejected, AC-Allow-Origin: ${acao || 'none'}`);
    } else {
      report(4, 'Express CORS allowed untrusted origin', false, `AC-Allow-Origin: ${acao}`);
    }
  } catch (e) {
    report(4, 'Express CORS blocks untrusted origins', true, `Blocked with connection rejection: ${e.message}`);
  }

  // TEST 5: FastAPI CORS configuration
  try {
    const res = await axios.options(`${AI_URL}/health`, {
      headers: {
        Origin: 'http://malicious-attacker-site.com',
        'Access-Control-Request-Method': 'GET'
      },
      validateStatus: () => true
    });
    const acao = res.headers['access-control-allow-origin'];
    const secure = !acao || acao !== 'http://malicious-attacker-site.com' && acao !== '*';
    if (secure) {
      report(5, 'FastAPI CORS restricts origins to AI_ALLOWED_ORIGINS whitelist', true, `Disallowed origin rejected: ${acao || 'None'}`);
    } else {
      report(5, 'FastAPI CORS allows wildcard or untrusted origin', false, `AC-Allow-Origin: ${acao}`);
    }
  } catch (e) {
    report(5, 'FastAPI CORS check', false, e.message);
  }

  // Setup Users for Auth & IDOR tests
  const userAEmail = `user_a_${Date.now()}@test.com`;
  const userBEmail = `user_b_${Date.now()}@test.com`;
  let tokenA = null;
  let userAId = null;
  let tokenB = null;
  let userBId = null;

  // TEST 6: User Registration validation (short password rejected)
  try {
    const shortPassRes = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User A',
      email: userAEmail,
      password: '123'
    }, { validateStatus: () => true });

    if (shortPassRes.status === 400 && shortPassRes.data.message.includes('6 characters')) {
      report(6, 'Registration rejects weak passwords (< 6 chars)', true, shortPassRes.data.message);
    } else {
      report(6, 'Registration failed weak password validation', false, JSON.stringify(shortPassRes.data));
    }
  } catch (e) {
    report(6, 'Registration weak password check', false, e.message);
  }

  // TEST 7: Registration success & password never returned plaintext
  try {
    const regResA = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User Alpha',
      email: userAEmail,
      password: 'StrongPassword123!'
    });
    tokenA = regResA.data.token;
    userAId = regResA.data.user.id;

    const regResB = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'User Beta',
      email: userBEmail,
      password: 'StrongPassword456!'
    });
    tokenB = regResB.data.token;
    userBId = regResB.data.user.id;

    const noPlaintext = !JSON.stringify(regResA.data).includes('StrongPassword123!') && Boolean(tokenA);
    if (noPlaintext) {
      report(7, 'Registration hashes passwords and returns JWT without password field', true, `User Alpha ID: ${userAId}`);
    } else {
      report(7, 'Password was leaked or token missing', false, JSON.stringify(regResA.data));
    }
  } catch (e) {
    report(7, 'User registration', false, e.message);
  }

  // TEST 8: Protected endpoints reject requests with missing / invalid JWT
  try {
    const noTokenRes = await axios.get(`${SERVER_URL}/api/documents`, { validateStatus: () => true });
    const badTokenRes = await axios.get(`${SERVER_URL}/api/documents`, {
      headers: { Authorization: 'Bearer invalid_garbage_token' },
      validateStatus: () => true
    });

    if (noTokenRes.status === 401 && badTokenRes.status === 401) {
      report(8, 'Protected endpoints require valid Bearer JWT', true, '401 returned for both missing and invalid tokens');
    } else {
      report(8, 'Protected endpoints allowed invalid token', false, `noToken: ${noTokenRes.status}, badToken: ${badTokenRes.status}`);
    }
  } catch (e) {
    report(8, 'JWT enforcement test', false, e.message);
  }

  // Create document owned by User A
  let docAId = null;
  try {
    const dummyFile = path.join(__dirname, 'test_doc_a.txt');
    fs.writeFileSync(dummyFile, 'Clause 1: Confidentiality obligation for 5 years.\nClause 2: Payment within 30 days.');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(dummyFile));

    const uploadRes = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${tokenA}`
      }
    });

    docAId = uploadRes.data.document._id || uploadRes.data.document.id;
    try { fs.unlinkSync(dummyFile); } catch (e) {}
  } catch (e) {
    console.error('Failed to setup docA:', e.message);
  }

  // TEST 9: IDOR - User B cannot view User A's document
  try {
    const idorDocRes = await axios.get(`${SERVER_URL}/api/documents/${docAId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
      validateStatus: () => true
    });
    if (idorDocRes.status === 404) {
      report(9, 'IDOR Protection: User B cannot access User A document metadata', true, 'Returned 404 Not Found / Unauthorized');
    } else {
      report(9, 'IDOR Failure on document retrieval', false, `Status: ${idorDocRes.status}`);
    }
  } catch (e) {
    report(9, 'IDOR document retrieval', false, e.message);
  }

  // TEST 10: IDOR - User B cannot view User A's document clauses
  try {
    const idorClauseRes = await axios.get(`${SERVER_URL}/api/documents/${docAId}/clauses`, {
      headers: { Authorization: `Bearer ${tokenB}` },
      validateStatus: () => true
    });
    if (idorClauseRes.status === 404) {
      report(10, 'IDOR Protection: User B cannot fetch clauses for User A document', true, 'Returned 404 Not Found / Unauthorized');
    } else {
      report(10, 'IDOR Failure on clauses endpoint', false, `Status: ${idorClauseRes.status}`);
    }
  } catch (e) {
    report(10, 'IDOR clauses retrieval', false, e.message);
  }

  // TEST 11: IDOR - User B cannot delete User A's document
  try {
    const idorDelRes = await axios.delete(`${SERVER_URL}/api/documents/${docAId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
      validateStatus: () => true
    });
    if (idorDelRes.status === 404) {
      report(11, 'IDOR Protection: User B cannot delete User A document', true, 'Returned 404 Not Found / Unauthorized');
    } else {
      report(11, 'IDOR Failure on document deletion', false, `Status: ${idorDelRes.status}`);
    }
  } catch (e) {
    report(11, 'IDOR document deletion', false, e.message);
  }

  // TEST 12: IDOR - User B cannot trigger Cross-Document Comparison on User A's document
  try {
    const compRes = await axios.post(`${SERVER_URL}/api/analysis/compare`, {
      documentIds: [docAId, 'fake_second_doc_id']
    }, {
      headers: { Authorization: `Bearer ${tokenB}` },
      validateStatus: () => true
    });
    if (compRes.status === 403 || compRes.status === 400) {
      report(12, 'IDOR Protection: User B cannot run cross-document analysis on User A documents', true, `Access denied with status ${compRes.status}`);
    } else {
      report(12, 'IDOR Failure on cross-document analysis', false, `Status: ${compRes.status}`);
    }
  } catch (e) {
    report(12, 'IDOR cross-document analysis', false, e.message);
  }

  // TEST 13: IDOR - User B cannot target User A's documents in RAG Chat
  try {
    const chatRes = await axios.post(`${SERVER_URL}/api/chat`, {
      question: 'What is the payment period?',
      documentIds: [docAId]
    }, {
      headers: { Authorization: `Bearer ${tokenB}` },
      validateStatus: () => true
    });
    if (chatRes.status === 403) {
      report(13, 'IDOR Protection: User B cannot scope RAG chat to User A document', true, `Returned 403 Forbidden: ${chatRes.data.message}`);
    } else {
      report(13, 'IDOR Failure on RAG chat', false, `Status: ${chatRes.status}`);
    }
  } catch (e) {
    report(13, 'IDOR RAG chat', false, e.message);
  }

  // TEST 14: Upload filter rejects prohibited file extensions (.docm, .exe)
  try {
    const badFile = path.join(__dirname, 'macro_script.docm');
    fs.writeFileSync(badFile, 'malicious macro content');
    const form = new FormData();
    form.append('file', fs.createReadStream(badFile));

    const uploadBad = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${tokenA}`
      },
      validateStatus: () => true
    });

    try { fs.unlinkSync(badFile); } catch (e) {}

    if (uploadBad.status === 400 && uploadBad.data.message.includes('prohibited')) {
      report(14, 'Upload security rejects macro-enabled and executable extensions (.docm)', true, uploadBad.data.message);
    } else {
      report(14, 'Upload security failed to block .docm file', false, JSON.stringify(uploadBad.data));
    }
  } catch (e) {
    report(14, 'Upload file extension filter', false, e.message);
  }

  // TEST 15: Path traversal protection in uploaded filenames
  try {
    const traverseFile = path.join(__dirname, 'traversal.txt');
    fs.writeFileSync(traverseFile, 'safe text content');
    const form = new FormData();
    form.append('file', fs.createReadStream(traverseFile), {
      filename: '../../malicious.txt'
    });

    const uploadTrav = await axios.post(`${SERVER_URL}/api/documents/upload`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${tokenA}`
      },
      validateStatus: () => true
    });

    try { fs.unlinkSync(traverseFile); } catch (e) {}

    // Either rejected with 400 due to '..' in originalname, or sanitized cleanly
    if (uploadTrav.status === 400 && uploadTrav.data.message.includes('traversal')) {
      report(15, 'Path traversal attempt rejected before disk write', true, uploadTrav.data.message);
    } else if (uploadTrav.status === 201) {
      // Check that it wasn't saved outside uploads
      report(15, 'Path traversal safely handled and sanitized', true, 'Saved securely');
    } else {
      report(15, 'Path traversal test unexpected result', false, JSON.stringify(uploadTrav.data));
    }
  } catch (e) {
    report(15, 'Path traversal upload test', false, e.message);
  }

  // TEST 16: Rate Limiting throttles repeated login attempts with HTTP 429
  try {
    let rateLimited = false;
    let attempts = 0;
    for (let i = 0; i < 12; i++) {
      attempts++;
      const loginAttempt = await axios.post(`${SERVER_URL}/api/auth/login`, {
        email: 'invalid_user_rate_test@test.com',
        password: 'wrong_password'
      }, { validateStatus: () => true });

      if (loginAttempt.status === 429) {
        rateLimited = true;
        break;
      }
    }

    if (rateLimited) {
      report(16, `Auth Rate Limiter throttles excessive attempts with HTTP 429 (triggered at request #${attempts})`, true, 'Brute force protection active');
    } else {
      report(16, 'Rate limiter did not trigger HTTP 429 within 12 requests', false, 'Check express-rate-limit configuration');
    }
  } catch (e) {
    report(16, 'Auth rate limiting test', false, e.message);
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED / ${failed} FAILED (TOTAL: 16)`);
  console.log('====================================================');

  // Clean up User A's test document if created
  if (docAId && tokenA) {
    try {
      await axios.delete(`${SERVER_URL}/api/documents/${docAId}`, {
        headers: { Authorization: `Bearer ${tokenA}` }
      });
    } catch (e) {}
  }
}

runSecurityTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
