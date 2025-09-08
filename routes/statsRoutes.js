const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/authMiddleware');
const statsController = require('../controllers/statsController');

// Public analytics for normal users
router.get('/top-posts', auth, statsController.getTopPosts);

module.exports = router;
