const User = require('../models/userModel');

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;
    let avatar = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;

    const update = {};
    if (username) update.username = username;
    if (bio) update.bio = bio;
    if (avatar) update.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true }
    ).select('-password')

    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const user = await User.findById(userId)
      .select('-role -password')
      .populate('following', 'username')
      .populate('followers', 'username')
      .lean();

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Set status
exports.setStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Search users by their id (will try username if possible)
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params
    // console.log('username by params', req.params.username);
    // console.log('User', await User.find({username: username }));   
    const findUser = await User.find({ username: username }).select('-password')
      .populate('following', 'username')
      .populate('followers', 'username')
    if (!findUser) return res.status(404).json({ error: 'Invalid username or user not found' })
    res.json(findUser)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

