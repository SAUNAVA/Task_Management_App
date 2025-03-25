import express from 'express';
import auth from '../middleware/auth.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js'; 

const router = express.Router();

// Admin middleware
const admin = (req, res, next) => {
  if (req.user.role!=='admin') {
    return res.status(403).json({ error: "Admin access denied" });
  }
  next();
};

// Get all users
router.get('/users', auth, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all tasks
router.get('/tasks', auth, admin, async (req, res) => {
  try {
    const tasks = await Task.find().populate('user', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user admin status
router.patch('/users/:id', auth, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isAdmin: req.body.isAdmin },
      { new: true }
    ).select('-password');
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;