const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activity.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getActivities);

module.exports = router;
