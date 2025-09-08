const express = require('express')
const router = express.Router()

const { 
    createPost, 
    getPostById, 
    updatePostById, 
    deletePostById, 
    toggleLike, 
    createComments, 
    getComments, 
    getAllPosts, 
    getAllComments, 
    getPostByUsername,
    deleteCommentById,
    updateCommentById
} = require('../controllers/postController')

const validate = require('../middlewares/validate')
const { postValidator } = require('../validators/postValidator')
const { auth } = require('../middlewares/authMiddleware')
const upload = require('../middlewares/upload')

const requireRole = require('../middlewares/requireRole')

// POST ROUTES
router.post('/', auth, upload.single("image"), validate(postValidator), createPost)
router.get('/', auth, getAllPosts)
router.get('/comments', auth, getAllComments)
router.get('/users/:username', auth, getPostByUsername)
router.get('/:id', auth, getPostById)
router.put('/:id', auth, updatePostById)
router.delete('/:id', auth, requireRole('admin','user'), deletePostById)

// LIKE ROUTE
router.post('/:id/like', auth, toggleLike)

// COMMENTS ROUTES
router.post('/:id/comments', auth, createComments)
router.get('/:id/comments', auth, getComments)
router.put('/:id/comments/:commentId', auth, requireRole('admin','user'), updateCommentById)  
router.delete('/:id/comments/:commentId', auth, requireRole('admin','user'), deleteCommentById) 

module.exports = router
