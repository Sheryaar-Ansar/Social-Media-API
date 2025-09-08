const express = require('express');
const { followToggle } = require('../controllers/followController');
const { auth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/toggle/:username', auth, followToggle);

module.exports = router;

