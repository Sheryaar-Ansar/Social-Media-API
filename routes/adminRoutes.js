const express = require('express');
const router = express.Router();

const { auth } = require('../middlewares/authMiddleware');
const requireRole = require('../middlewares/requireRole');

const adminController = require('../controllers/adminController');

// Admin-only routes
router.get('/users', auth, requireRole('admin'), adminController.getAllUsers);
router.delete('/users/:username', auth, requireRole('admin'), adminController.deleteUser);
router.delete('/posts/:id', auth, requireRole('admin'), adminController.deletePost);
router.get('/stats', auth, requireRole('admin'), adminController.getStats);

// Active Users (admin only)
router.get('/stats/active-users', auth, requireRole('admin'), adminController.getActiveUsers);

// Dashboard
router.get('/dashboard', auth, requireRole('admin'), (req, res) => {
  return res.json({
    success: true,
    message: `Welcome, ${req.user && req.user.username ? req.user.username : 'admin'}`
  });
});

module.exports = router;
