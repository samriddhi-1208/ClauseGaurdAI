const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(__dirname, 'db_fallback.json');

let memoryDb = {
  users: [],
  documents: [],
  clauses: [],
  analyses: [],
  contradictions: []
};

// Load initial state if exists
if (fs.existsSync(STORAGE_FILE)) {
  try {
    const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
    memoryDb = JSON.parse(raw);
  } catch (err) {
    console.log('[Fallback Store] Initializing new JSON store');
  }
}

function saveData() {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(memoryDb, null, 2));
  } catch (err) {
    console.error('[Fallback Store Error] Failed to write data:', err);
  }
}

module.exports = {
  db: memoryDb,
  saveData
};
