const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// ✅ Register (Local)
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: newUser._id, name, email, role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ✅ Login (Local)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ error: "User not found or no password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Google OAuth Start
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

// ✅ Google OAuth Callback
// ✅ Google OAuth Callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  async (req, res) => {
    try {
      const profile = req.user;

      let user = await User.findOne({ googleId: profile.googleId });

      if (!user) {
        user = await User.create({
          name: profile.name,
          email: profile.email,
          googleId: profile.googleId,
          picture: profile.picture, // ✅ Save Google profile pic
          role: 'general',
        });
      }

      // ✅ Include email and picture in token
      const token = jwt.sign({
  id: user._id,
  name: user.name,
  email: user.email,
  picture: user.picture,
  role: user.role || 'general'  // <-- Include role
}, JWT_SECRET, { expiresIn: '7d' });
console.log("🔑 Google token:", token);

     res.redirect(`http://localhost:5173/login-success?token=${token}`);

    } catch (err) {
      console.error("Google OAuth Error:", err);
      res.redirect('/?error=google-login-failed');
    }
  }
);


module.exports = router;
