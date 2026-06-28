const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getProfile = async (req, res, next) => {
  try {
    successResponse(res, { user: req.user });
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, preferences } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    successResponse(res, { user }, 'Profile updated.');
  } catch (err) { next(err); }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return errorResponse(res, 'Current and new password required.', 400);
    }
    if (newPassword.length < 6) {
      return errorResponse(res, 'New password must be at least 6 characters.', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return errorResponse(res, 'Current password is incorrect.', 401);

    user.password = newPassword;
    await user.save();
    successResponse(res, null, 'Password changed successfully.');
  } catch (err) { next(err); }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const Board = require('../models/Board.model');
    const Task = require('../models/Task.model');

    const [totalBoards, tasks] = await Promise.all([
      Board.countDocuments({ owner: req.user._id, isArchived: false }),
      Task.find({ creator: req.user._id, isArchived: false }).select('status dueDate'),
    ]);

    const now = new Date();
    const activeTasks = tasks.filter(t => t.status !== 'done').length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const overdueTasks = tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now).length;

    successResponse(res, { totalBoards, activeTasks, completedTasks, overdueTasks, totalTasks: tasks.length });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, changePassword, getDashboardStats };
