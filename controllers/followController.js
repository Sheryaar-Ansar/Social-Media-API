const User = require("../models/userModel");
const mongoose = require("mongoose");

exports.followToggle = async (req, res) => {
    const { username } = req.params
    const loggedInUserId = req.user.id

    
    
    const userToFollow = await User.findOne({ username: username })
    const loggedInUser = await User.findById(loggedInUserId)
    if (!userToFollow) {
        return res.status(404).json({ message: "User not found!" })
    }
    if (userToFollow._id.toString() === loggedInUser) {
        return res.status(400).json({ message: "You cannot follow yourself!" })
    }
    const following = loggedInUser.following.some(f=>f.toString() === userToFollow._id.toString())
    const userToFollowObjectId = new mongoose.Types.ObjectId(userToFollow._id);
    const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUser);
    if (following) {
        await User.findByIdAndUpdate(
            loggedInUserObjectId,
            { $pull: { following: userToFollowObjectId }, $inc: { followingCount: -1 } },
            { new: true }
        )
        await User.findByIdAndUpdate(
            userToFollowObjectId,
            { $pull: { followers: loggedInUserObjectId }, $inc: { followersCount: -1 } },
            { new: true }
        )
        return res.json({
            message: `Unfollowed ${userToFollow.username} successfully`,
            following: false,
        })
    } else {
        await User.findByIdAndUpdate(
            loggedInUser,
            { $addToSet: { following: userToFollow._id }, $inc: { followingCount: 1 } },
            { new: true }
        )
        await User.findByIdAndUpdate(
            userToFollow._id,
            { $addToSet: { followers: loggedInUser }, $inc: { followersCount: 1 } },
            { new: true }
        )
        return res.json({
            message: `Followed ${userToFollow.username} successfully`,
            following: true,
        })
    }
}