const express = require('express')
const router  = express.Router()
const {
  getTasksByBoard, createTask, getTask, updateTask,
  moveTask, deleteTask, duplicateTask, archiveTask,
} = require('../controllers/task.controller')
const { protect } = require('../middleware/auth.middleware')
const Task = require('../models/Task.model')

router.use(protect)

// Global task search
router.get('/search', async (req, res, next) => {
  try {
    const { q = '' } = req.query
    if (!q.trim()) return res.json({ success: true, data: { tasks: [] } })
    const tasks = await Task.find({
      creator: req.user._id,
      isArchived: false,
      $or: [
        { title:       { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { labels:      { $in: [new RegExp(q, 'i')] } },
      ],
    }).limit(10).select('title description priority dueDate status board labels')
    res.json({ success: true, data: { tasks } })
  } catch (err) { next(err) }
})

router.get('/board/:boardId', getTasksByBoard)
router.post('/board/:boardId', createTask)
router.get('/:id',            getTask)
router.patch('/:id',          updateTask)
router.patch('/:id/move',     moveTask)
router.delete('/:id',         deleteTask)
router.post('/:id/duplicate', duplicateTask)
router.patch('/:id/archive',  archiveTask)

module.exports = router
