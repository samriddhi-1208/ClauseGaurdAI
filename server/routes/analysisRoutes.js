const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/compare', analysisController.compareDocuments);
router.get('/', analysisController.getAnalyses);
router.get('/:id', analysisController.getAnalysisById);

module.exports = router;
