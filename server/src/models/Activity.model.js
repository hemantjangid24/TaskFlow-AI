const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Board',
    default: null,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    default: null,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created_board', 'updated_board', 'deleted_board',
      'created_task', 'updated_task', 'deleted_task',
      'moved_task', 'completed_task', 'archived_task',
      'ai_suggestion_used',
    ],
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

activitySchema.index({ user: 1, createdAt: -1 });
activitySchema.index({ board: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
