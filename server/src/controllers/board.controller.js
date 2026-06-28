const Board = require('../models/Board.model');
const Task = require('../models/Task.model');
const Activity = require('../models/Activity.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const getBoards = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { owner: req.user._id, isArchived: false };
    if (search) query.$text = { $search: search };

    const boards = await Board.find(query).sort({ createdAt: -1 }).lean();

    // Attach task counts
    const boardIds = boards.map(b => b._id);
    const taskCounts = await Task.aggregate([
      { $match: { board: { $in: boardIds }, isArchived: false } },
      { $group: { _id: { board: '$board', status: '$status' }, count: { $sum: 1 } } },
    ]);

    const countMap = {};
    taskCounts.forEach(({ _id, count }) => {
      if (!countMap[_id.board]) countMap[_id.board] = {};
      countMap[_id.board][_id.status] = count;
    });

    const boardsWithStats = boards.map(b => ({
      ...b,
      taskStats: countMap[b._id] || {},
      totalTasks: Object.values(countMap[b._id] || {}).reduce((a, c) => a + c, 0),
    }));

    successResponse(res, { boards: boardsWithStats });
  } catch (err) { next(err); }
};

const createBoard = async (req, res, next) => {
  try {
    const { title, description, color, emoji } = req.body;
    if (!title) return errorResponse(res, 'Board title is required.', 400);

    const board = await Board.create({
      title, description, color, emoji,
      owner: req.user._id,
      members: [req.user._id],
    });

    await Activity.create({
      user: req.user._id, board: board._id,
      action: 'created_board', meta: { title },
    });

    successResponse(res, { board }, 'Board created.', 201);
  } catch (err) { next(err); }
};

const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, owner: req.user._id });
    if (!board) return errorResponse(res, 'Board not found.', 404);
    successResponse(res, { board });
  } catch (err) { next(err); }
};

const updateBoard = async (req, res, next) => {
  try {
    const { title, description, color, emoji } = req.body;
    const board = await Board.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { title, description, color, emoji },
      { new: true, runValidators: true }
    );
    if (!board) return errorResponse(res, 'Board not found.', 404);

    await Activity.create({
      user: req.user._id, board: board._id,
      action: 'updated_board', meta: { title: board.title },
    });

    successResponse(res, { board }, 'Board updated.');
  } catch (err) { next(err); }
};

const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!board) return errorResponse(res, 'Board not found.', 404);

    await Task.deleteMany({ board: req.params.id });
    await Activity.deleteMany({ board: req.params.id });

    successResponse(res, null, 'Board deleted.');
  } catch (err) { next(err); }
};

module.exports = { getBoards, createBoard, getBoard, updateBoard, deleteBoard };
