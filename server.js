const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Session & Passport
app.use(session({
  secret: process.env.JWT_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/passportConfig');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Route Modules
const authRoutes = require('./routes/auth');
const imageEditing = require("./CreativeAI");
const communityRoutes = require('./community');
const healthcareRoutes = require('./heath');
const educationRoutes = require('./education');
const replaceObjectRoute = require('./sr');

// ✅ Use Routes
app.use('/auth', authRoutes);
app.use("/api/image", imageEditing);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/image/sr', replaceObjectRoute);

// ✅ Default Route
app.get('/', (req, res) => {
  res.send('🎓 Medhavi AI Backend is running');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
