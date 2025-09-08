const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const { post } = require('../routes/authRoutes')
const mongoose = require('mongoose')


// POST SECTION

// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const { text } = req.body
        if (!text && !req.file) return res.status(400).json({ error: "Post not created as image OR text has to be inserted" })

        const newPost = await Post.create({
            authorName: req.user.id,
            text,
            image: req.file ? `/uploads/${req.file.filename}` : null
        })
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
// GET ALL POSTS
exports.getAllPosts = async (req, res) => {
    const { page = 1, limit = 5 } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const userId = req.user.id
    const posts = await Post.find({ authorName: userId })
        .populate('authorName', 'username')
        .populate('likes', 'username')
        .populate({
            path: 'comments',
            select: 'authorName text',
            populate: { path: 'authorName', select: 'username' }
        })
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit))
    const postsObj = posts.map(p => ({
        ...p.toObject(),
        likesCount: p.likes.length,
        commentsCount: p.comments.length,
        userLike: p.likes.some(user => user._id.toString() === req.user.id)
    }))
    const totalPosts = await Post.countDocuments({ authorName: userId })
    res.json({
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPosts: totalPosts,
        postsObj
    })
}
// GET POST BY ID
exports.getPostById = async (req, res) => {
    const postById = await Post.findById(req.params.id)
        .populate('authorName', 'username')
        .populate('likes', 'username')
        .populate({
            path: 'comments',
            select: 'authorName text',
            populate: { path: 'authorName', select: 'username' }
        })
    // not working on nested path
    // .populate('comments', 'text authorName')
    // .populate('comments.authorName', 'username')
    if (!postById) return res.status(404).json({ error: "The post you are searching for is no longer available" })
    res.json({
        ...postById.toObject(),
        likesCount: postById.likes.length,
        commentsCount: postById.comments.length,
        userLike: postById.likes.some(user => user._id.toString() === req.user.id)
    })
}
// UPDATE POST
exports.updatePostById = async (req, res) => {
    try {
        const existingPost = await Post.findById(req.params.id)

        if (!existingPost) return res.status(404).json({ error: "The post you are searching for is no longer available" })
        // if (existingPost.authorName !== req.user.id) {

        //     console.log(existingPost.authorName, req.user.id)
        // }
        if (existingPost.authorName.toString() !== req.user.id) return res.status(403).json({ error: "You're not authorized to perform this action" })

        const updatedData = {}
        if (req.body.text) updatedData.text = req.body.text
        if (req.file) updatedData.image = `/uploads/${req.file.filename}`

        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: updatedData },
            { new: true, runValidators: true }
        )
            .populate('authorName', 'username')
            .populate('likes', 'username')
            .populate({
                path: 'comments',
                select: 'authorName text',
                populate: { path: 'authorName', select: 'username' }
            })
        res.json(post)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
// DELETE POST
exports.deletePostById = async (req, res) => {
    try {
        const existingPost = await Post.findById(req.params.id)
        if (!existingPost) return res.status(404).json({ error: "The post you are searching is no longer available" })
        if (existingPost.authorName.toString() !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: "You're not authorized to perform this action" })
        await Post.findByIdAndDelete(req.params.id)
        res.json({ message: "Post deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
// GET POST BY USERNAME
exports.getPostByUsername = async (req, res) => {
    const { page = 1, limit = 5 } = req.query
    const { username } = req.params
    // console.log('username by params', req.params.username);
    const user = await User.findOne({ username: username })
    if (!user) return res.status(404).json({ error: "User not found" })
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const totalPosts = await Post.countDocuments({ authorName: user._id })
    const userPosts = await Post.find({ authorName: user._id })
        .populate('authorName', 'username')
        .populate('likes', 'username')
        .populate({
            path: 'comments',
            select: 'authorName text',
            populate: { path: 'authorName', select: 'username' }
        })
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)

    if (userPosts.length === 0) return res.status(404).json({ error: "No posts found for this user" })
    res.json({
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalPosts: totalPosts,
        userPosts
    })
}


// LIKE SECTION

// TOGGLE LIKE
exports.toggleLike = async (req, res) => {
    try {
        const postId = req.params.id
        const userId = req.user.id

        const existingPost = await Post.findById(postId).select('likes')
        if (!existingPost) return res.status(404).json({ error: "The post you are searching is no longer available" })

        const alreadyLiked = existingPost.likes.includes(userId)

        const updated = alreadyLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updated,
            { new: true, runValidators: true }
        ).select("likes")

        res.json({
            likes: !alreadyLiked,
            likesCount: updatedPost.likes.length
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


// COMMENTS SECTION

// CREATE COMMENT
exports.createComments = async (req, res) => {
    try {
        const { text } = req.body
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).json({ error: error.message })

        const newComment = await Comment.create({
            authorName: req.user.id,
            text,
            post: post._id
        })
        await Post.findByIdAndUpdate(
            req.params.id,
            { $push: { comments: newComment._id } },
            { new: true, runValidators: true }
        )
        res.status(200).json(newComment)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
// GET COMMENTS
exports.getComments = async (req, res) => {
    const { page = 1, limit = 5 } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const comments = await Comment.find({ post: req.params.id })
        .populate('authorName', 'username')
        .sort("-createdAt")
        .skip(skip)
        .limit(parseInt(limit))
    const totalComments = await Comment.countDocuments({post: req.params.id})
    res.json({
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalComments: totalComments,
        comments
    })
}
// UPDATE COMMENT
exports.updateCommentById = async (req, res) => {
    try {
        const { id, commentId } = req.params; // postId, commentId
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        // Ensure comment belongs to the post
        if (comment.post.toString() !== id) {
            return res.status(400).json({ error: "Comment does not belong to this post" });
        }

        // Only author or admin can update
        if (comment.authorName.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "You're not authorized to update this comment" });
        }

        // Update text only
        if (!req.body.text) return res.status(400).json({ error: "Text is required" });

        comment.text = req.body.text;
        await comment.save();

        res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// DELETE COMMENT
exports.deleteCommentById = async (req, res) => {
    try {
        const { id, commentId } = req.params; // postId, commentId
        const userId = req.user.id;

        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ error: "Comment not found" });

        // Ensure comment belongs to the post
        if (comment.post.toString() !== id) {
            return res.status(400).json({ error: "Comment does not belong to this post" });
        }

        // Only author or admin can delete
        if (comment.authorName.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "You're not authorized to delete this comment" });
        }

        // Delete comment
        await Comment.findByIdAndDelete(commentId);

        // Remove reference from Post
        await Post.findByIdAndUpdate(
            id,
            { $pull: { comments: commentId } },
            { new: true }
        );

        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// GET ALL COMMENTS
exports.getAllComments = async (req, res) => {
    const { page = 1, limit = 5 } = req.query
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const userId = req.user.id
    
    const allComments = await Comment.find({ authorName: userId })
        .populate({
            path: 'post',
            select: 'authorName',
            populate: {path: "authorName", select: "username"}
        })
        .populate('authorName', 'username')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
    // console.log(allComments.authorName, userId);
    const totalComments = await Comment.countDocuments({ authorName: userId })
    res.json({
        page: parseInt(page),
        pageSize: parseInt(limit),
        totalComments: totalComments,
        allComments
    })
}
