const { getProfile, updateProfile, setStatus, getUserByUsername } = require('../controllers/userController');
const { auth } = require('../middlewares/authMiddleware');
const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const requireRole = require('../middlewares/requireRole');

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/profile', auth, upload.single('avatar'), updateProfile);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/profile', auth, getProfile);

/**
 * @swagger
 * /api/users/status/{id}:
 *   patch:
 *     summary: Suspend or activate a user profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, suspended]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.get('/:username', getUserByUsername)
router.patch('/status/:id', auth, requireRole('admin'), setStatus);


module.exports = router;