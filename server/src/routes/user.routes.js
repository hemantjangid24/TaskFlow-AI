const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getDashboardStats } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.patch('/password', changePassword);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
