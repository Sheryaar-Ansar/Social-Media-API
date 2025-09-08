const Post = require('../models/postModel');

exports.getTopPosts = async (req, res) => {
  try {
    const { days = 7, limit = 5 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const topPosts = await Post.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $project: {
          text: 1,
          likesCount: { $size: "$likes" },
          commentsCount: { $size: "$comments" }
        }
      },
      {
        $addFields: { engagement: { $add: ["$likesCount", "$commentsCount"] } }
      },
      { $sort: { engagement: -1 } },
      { $limit: parseInt(limit) }
    ]);

    return res.json({ success: true, topPosts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
