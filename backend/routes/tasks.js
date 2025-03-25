import express from "express";
import Task  from "../models/task.model.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',auth, async(req,res)=>{
    try {
        const task = new Task({
            ...req.body,
            user: req.user.userId
        })
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({error : error.message})
    }
})

router.get('/', auth, async (req, res) => {
    try {
      const tasks = await Task.find({ user: req.user.userId });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.patch('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user.userId },
        req.body,
        { new: true }
      );
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', auth, async (req, res) => {
    try {
      const task = await Task.findOneAndDelete({
        _id: req.params.id,
        user: req.user.userId
      });
      if (!task) return res.status(404).json({ error: 'Task not found' });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

export default router