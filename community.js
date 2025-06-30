// community.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require("multer");


// Storage Config for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads/study-materials';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/upload-material', verifyUser, upload.single('file'), async (req, res) => {
  const role = req.user.role || 'user';
  if (role !== 'teacher') {
    return res.status(403).json({ error: 'Only teachers can upload materials' });
  }

  res.json({ message: 'Uploaded successfully', filename: req.file.filename });
});

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  tags: [String],
  author: { type: String },
  createdAt: { type: Date, default: Date.now },
  answers: [{ body: String, author: String, createdAt: { type: Date, default: Date.now } }]
});

const Post = mongoose.model('Post', postSchema);


function verifyUser(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// === ROUTES ===

// 📌 Ask a Question
router.post('/ask', verifyUser, async (req, res) => {
  const { title, body, tags } = req.body;
  const post = new Post({ title, body, tags, author: req.user.name });
  await post.save();
  res.json({ message: 'Posted successfully', post });
});


router.post('/answer/:postId', verifyUser, async (req, res) => {
  const { body } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.answers.push({ body, author: req.user.name });
  await post.save();

  res.json({ message: 'Answer added', post });
});


router.get('/questions', async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});


router.get('/questions/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  res.json(post);
});

module.exports = router;
