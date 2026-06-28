const express  = require('express')
const router   = express.Router()
const ctrl     = require('../controllers/board.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate.middleware')
const schemas  = require('../validators/schemas')

router.use(protect)
router.get   ('/',    ctrl.getBoards)
router.post  ('/',    validate(schemas.createBoard), ctrl.createBoard)
router.get   ('/:id', ctrl.getBoard)
router.patch ('/:id', validate(schemas.updateBoard), ctrl.updateBoard)
router.delete('/:id', ctrl.deleteBoard)

module.exports = router
