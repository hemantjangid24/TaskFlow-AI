const express = require('express');
const router = express.Router();
const { suggest } = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/suggest', suggest);

module.exports = router;
