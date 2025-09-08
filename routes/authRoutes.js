const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const { auth } = require("../middlewares/authMiddleware.js");
const validate = require('../middlewares/validate.js');
const { userValidator } = require("../validators/userValidator.js");
const upload = require("../middlewares/upload.js");

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Register
router.post("/register", upload.single("avatar"), validate(userValidator), async (req, res) => {
  const { username, email, password, bio, avatar } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, bio, avatar: req.file ? `/uploads/avatars/${req.file.filename}` : undefined });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



// // Logout
// router.post("/logout", auth, (req, res) => {
//   // Since JWT is stateless, we simply tell client to discard the token
//   res.json({ message: "Logged out" });
// });

module.exports = router;
