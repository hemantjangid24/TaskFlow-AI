const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Board title is required'],
    trim: true,
    maxlength: [80, 'Title cannot exceed 80 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters'],
    default: '',
  },
  color: {
    type: String,
    default: '#6366f1',
  },
  emoji: {
    type: String,
    default: '📋',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

boardSchema.index({ owner: 1, createdAt: -1 });
boardSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Board', boardSchema);
