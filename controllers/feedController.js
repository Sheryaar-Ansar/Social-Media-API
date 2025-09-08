const Post = require("../models/postModel");
const User = require("../models/userModel")

exports.getFeed = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            sort = 'createdAt',
            order = 'desc'
        } = req.query
        const userId = req.user.id
        console.log(userId)

        const skip = (parseInt(page) - 1) * parseInt(limit)
        const sortBy = {}
        sortBy[sort] = order === 'desc' ? -1 : 1

        const user = await User.findById(userId).select('following')
        const followingId = user.following.concat(userId)

        const posts = await Post.find({ authorName: { $in: followingId } })
            .populate('authorName', 'username')
            .populate('likes', 'username')
            .populate({
                path: 'comments',
                select: 'authorName text',
                populate: { path: 'authorName', select: 'username' }
            })
            .sort(sortBy)
            .skip(skip)
            .limit(parseInt(limit))
            .lean()

        const feed = posts.map((p) => ({
            ...p,
            likesCount: p.likes.length,
            commentsCount: p.comments.length,
            userLike: p.likes.some(user => user._id.toString() === userId)
        }))
        const totalFeed = await Post.countDocuments({authorName: followingId})
        res.json({
            page: parseInt(page),
            pageSize: parseInt(limit),
            totalFeed: totalFeed,
            feed
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}