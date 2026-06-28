const Task = require('../models/Task.model');
const Board = require('../models/Board.model');
const Activity = require('../models/Activity.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getTasksByBoard = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ _id: boardId, owner: req.user._id });
    if (!board) return errorResponse(res, 'Board not found.', 404);

    const tasks = await Task.find({ board: boardId, isArchived: false })
      .populate('assignee', 'name avatar email')
      .sort({ order: 1, createdAt: -1 });

    successResponse(res, { tasks });
  } catch (err) { next(err); }
};

const createTask = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ _id: boardId, owner: req.user._id });
    if (!board) return errorResponse(res, 'Board not found.', 404);

    const { title, description, status, priority, dueDate, effortHours, labels, assignee } = req.body;
    if (!title) return errorResponse(res, 'Task title is required.', 400);

    const lastTask = await Task.findOne({ board: boardId, status: status || 'todo' }).sort({ order: -1 });
    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title, description, status, priority, dueDate, effortHours, labels, assignee, order,
      board: boardId, creator: req.user._id,
    });

    await Activity.create({
      user: req.user._id, board: boardId, task: task._id,
      action: 'created_task', meta: { title },
    });

    const populated = await task.populate('assignee', 'name avatar email');
    successResponse(res, { task: populated }, 'Task created.', 201);
  } catch (err) { next(err); }
};

const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, creator: req.user._id })
      .populate('assignee', 'name avatar email')
      .populate('creator', 'name avatar');
    if (!task) return errorResponse(res, 'Task not found.', 404);
    successResponse(res, { task });
  } catch (err) { next(err); }
};

const updateTask = async (req, res, next) => {
  try {
    const allowed = ['title', 'description', 'status', 'priority', 'dueDate', 'effortHours', 'labels', 'assignee', 'aiSuggestion'];
    const updates = {};
    allowed.forEach(key => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id },
      updates,
      { new: true, runValidators: true }
    ).populate('assignee', 'name avatar email');

    if (!task) return errorResponse(res, 'Task not found.', 404);

    await Activity.create({
      user: req.user._id, board: task.board, task: task._id,
      action: 'updated_task', meta: { title: task.title, updates: Object.keys(updates) },
    });

    successResponse(res, { task }, 'Task updated.');
  } catch (err) { next(err); }
};

const moveTask = async (req, res, next) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status, order },
      { new: true }
    );
    if (!task) return errorResponse(res, 'Task not found.', 404);

    await Activity.create({
      user: req.user._id, board: task.board, task: task._id,
      action: 'moved_task', meta: { title: task.title, toStatus: status },
    });

    successResponse(res, { task }, 'Task moved.');
  } catch (err) { next(err); }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id });
    if (!task) return errorResponse(res, 'Task not found.', 404);

    await Activity.create({
      user: req.user._id, board: task.board,
      action: 'deleted_task', meta: { title: task.title },
    });

    successResponse(res, null, 'Task deleted.');
  } catch (err) { next(err); }
};

const duplicateTask = async (req, res, next) => {
  try {
    const original = await Task.findById(req.params.id);
    if (!original) return errorResponse(res, 'Task not found.', 404);

    const copy = await Task.create({
      ...original.toObject(),
      _id: undefined,
      title: `${original.title} (copy)`,
      status: 'todo',
      createdAt: undefined,
      updatedAt: undefined,
      order: original.order + 0.5,
    });

    successResponse(res, { task: copy }, 'Task duplicated.', 201);
  } catch (err) { next(err); }
};

const archiveTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
    if (!task) return errorResponse(res, 'Task not found.', 404);

    await Activity.create({
      user: req.user._id, board: task.board, task: task._id,
      action: 'archived_task', meta: { title: task.title },
    });

    successResponse(res, { task }, 'Task archived.');
  } catch (err) { next(err); }
};

module.exports = { getTasksByBoard, createTask, getTask, updateTask, moveTask, deleteTask, duplicateTask, archiveTask };
