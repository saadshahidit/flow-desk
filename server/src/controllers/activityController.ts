import { Response } from 'express';
import Activity from '../models/Activity';
import { AuthRequest } from '../types/index';

export const getTaskActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const activities = await Activity.find({ task: req.params.taskId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(activities);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
