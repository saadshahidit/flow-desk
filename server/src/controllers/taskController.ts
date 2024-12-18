import { Response } from 'express';
import Task from '../models/Task';
import Activity from '../models/Activity';
import { AuthRequest } from '../types/index';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { assignedTo: req.user?.id };
    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    if (req.user?.role !== 'admin' && String(task.assignedTo?._id) !== req.user?.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      assignedTo: assignedTo || undefined,
      createdBy: req.user?.id,
    });
    await Activity.create({ task: task._id, user: req.user?.id, action: 'Created this task' });
    const populated = await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, priority, dueDate },
      { new: true }
    )
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    await Activity.create({ task: task._id, user: req.user?.id, action: 'Updated task details' });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assignedTo } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.id, { assignedTo: assignedTo || null }, { new: true })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    await Activity.create({ task: task._id, user: req.user?.id, action: 'Assigned the task' });
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Accepted', 'In Progress', 'Review', 'Done'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }
    const task = await Task.findById(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    if (req.user?.role !== 'admin' && String(task.assignedTo) !== req.user?.id) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
    task.status = status;
    await task.save();
    await Activity.create({ task: task._id, user: req.user?.id, action: `Changed status to ${status}` });
    await task.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'createdBy', select: 'name email' },
    ]);
    res.json(task);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    await Activity.deleteMany({ task: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
