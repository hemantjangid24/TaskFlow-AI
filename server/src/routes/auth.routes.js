const express  = require('express')
const router   = express.Router()
const ctrl     = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const validate = require('../middleware/validate.middleware')
const schemas  = require('../validators/schemas')

router.post('/register',        validate(schemas.register),       ctrl.register)
router.post('/verify-otp',                                        ctrl.verifyOTP)
router.post('/resend-otp',                                        ctrl.resendOTP)
router.post('/login',           validate(schemas.login),          ctrl.login)
router.get ('/me',              protect,                          ctrl.getMe)
router.post('/forgot-password', validate(schemas.forgotPassword), ctrl.forgotPassword)
router.post('/reset-password',  validate(schemas.resetPassword),  ctrl.resetPassword)

module.exports = router
