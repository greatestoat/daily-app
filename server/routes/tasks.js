import { Router } from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task id' });
  next();
};

const pick = (body) => {
  const out = {};
  ['title', 'description', 'dateTime', 'endTime', 'priority', 'status'].forEach((k) => {
    if (body[k] !== undefined) out[k] = body[k];
  });
  return out;
};

// GET /api/tasks?q=keyword&from=ISO&to=ISO&status=completed
router.get('/', async (req, res, next) => {
  try {
    const { q, from, to, status } = req.query;
    const filter = {};
    if (q && q.trim()) {
      const rx = new RegExp(escapeRegex(q.trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }];
    }
    if (status) filter.status = status;
    if (from || to) {
      filter.dateTime = {};
      if (from) filter.dateTime.$gte = new Date(from);
      if (to) filter.dateTime.$lte = new Date(to);
    }
    res.json(await Task.find(filter).sort({ dateTime: 1 }));
  } catch (e) { next(e); }
});

// GET /api/tasks/:id
router.get('/:id', validId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// POST /api/tasks
router.post('/', async (req, res, next) => {
  try {
    res.status(201).json(await Task.create(pick(req.body)));
  } catch (e) { next(e); }
});

// PUT /api/tasks/:id  (edit any attribute)
router.put('/:id', validId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// PATCH /api/tasks/:id/status  (completed <-> in-progress)
router.patch('/:id/status', validId, async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['in-progress', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
});

// DELETE /api/tasks/:id
router.delete('/:id', validId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted', id: task._id });
  } catch (e) { next(e); }
});

// GET /api/tasks/summary/weeks -> open/completed counts per week (Mon-Sun, UTC)
router.get('/summary/weeks', async (_req, res, next) => {
  try {
    const data = await Task.aggregate([
      { $group: {
          _id: { $dateTrunc: { date: '$dateTime', unit: 'week', startOfWeek: 'monday' } },
          open: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 0, 1] } },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
      } },
      { $sort: { _id: -1 } },
    ]);
    res.json(data.map((d) => ({ weekStart: d._id, open: d.open, completed: d.completed })));
  } catch (e) { next(e); }
});

export default router;
