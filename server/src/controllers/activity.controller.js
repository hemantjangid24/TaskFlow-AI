const Activity = require('../models/Activity.model');
const { successResponse } = require('../utils/apiResponse');

const getActivities = async (req, res, next) => {
  try {
    const { boardId, limit = 20, page = 1 } = req.query;
    const query = { user: req.user._id };
    if (boardId) query.board = boardId;

    const skip = (Number(page) - 1) * Number(limit);
    const [activities, total] = await Promise.all([
      Activity.find(query)
        .populate('user', 'name avatar')
        .populate('board', 'title color')
        .populate('task', 'title')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Activity.countDocuments(query),
    ]);

    successResponse(res, { activities, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

module.exports = { getActivities };
