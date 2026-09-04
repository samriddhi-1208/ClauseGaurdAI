const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const documentController = require('../controllers/documentController');
const authMiddleware = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || ext === '.txt') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT legal documents are supported.'));
    }
  }
});

router.use(authMiddleware);

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocumentById);
router.get('/:id/clauses', documentController.getDocumentClauses);
router.delete('/:id', documentController.deleteDocument);

module.exports = router;
