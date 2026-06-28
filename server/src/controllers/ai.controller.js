const { suggestTaskEstimate } = require('../services/ai.service');
const Activity = require('../models/Activity.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const suggest = async (req, res, next) => {
  try {
    const { title, description, priority, labels, taskId, boardId } = req.body;
    if (!title) return errorResponse(res, 'Task title is required for AI suggestion.', 400);

    const suggestion = await suggestTaskEstimate({ title, description, priority, labels });

    // Log activity
    if (taskId && boardId) {
      await Activity.create({
        user: req.user._id,
        board: boardId,
        task: taskId,
        action: 'ai_suggestion_used',
        meta: { title },
      });
    }

    successResponse(res, { suggestion }, 'AI suggestion generated.');
  } catch (err) {
    next(err);
  }
};

module.exports = { suggest };
