const express = require('express');
const router = express.Router();
const demoController = require('../controllers/demoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/seed', demoController.seedDemoData);

module.exports = router;
