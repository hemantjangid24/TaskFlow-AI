const bcrypt   = require('bcryptjs')
const User     = require('../models/User.model')
const OTP      = require('../models/OTP.model')
const { signToken }             = require('../utils/jwt')
const { validatePassword, generateOTP } = require('../utils/password')
const { generateResetToken, hashToken } = require('../utils/crypto')
const { sendOTPEmail, sendPasswordResetEmail } = require('../config/mailer')

/* ── Step 1: Initiate registration ── */
const initiateRegister = async ({ name, email, password }) => {
  const existing = await User.findOne({ email })
  if (existing) { const e = new Error('An account with this email already exists.'); e.statusCode = 409; throw e }

  const { valid, errors } = validatePassword(password)
  if (!valid) { const e = new Error(errors[0]); e.statusCode = 400; e.allErrors = errors; throw e }

  const passwordHash = await bcrypt.hash(password, 12)
  const otp = generateOTP()
  await OTP.deleteMany({ email })
  await OTP.create({ email, otp, name, passwordHash })
  await sendOTPEmail({ to: email, name, otp })
  return { email }
}

/* ── Step 2: Verify OTP ── */
const verifyOTPAndRegister = async ({ email, otp }) => {
  const record = await OTP.findOne({ email })
  if (!record) { const e = new Error('OTP expired or not found. Please register again.'); e.statusCode = 400; throw e }
  if (record.attempts >= 5) { await OTP.deleteOne({ email }); const e = new Error('Too many incorrect attempts. Please register again.'); e.statusCode = 429; throw e }
  if (record.otp !== otp.toString().trim()) {
    await OTP.updateOne({ email }, { $inc: { attempts: 1 } })
    const remaining = 4 - record.attempts
    const e = new Error(`Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`); e.statusCode = 400; throw e
  }
  const user = new User({ name: record.name, email: record.email, password: record.passwordHash })
  user.$skipPasswordHash = true
  await user.save()
  await OTP.deleteOne({ email })
  return { user, token: signToken(user._id) }
}

/* ── Resend OTP ── */
const resendOTP = async ({ email }) => {
  const record = await OTP.findOne({ email })
  if (!record) { const e = new Error('No pending registration. Please register again.'); e.statusCode = 404; throw e }
  const otp = generateOTP()
  await OTP.updateOne({ email }, { otp, attempts: 0, createdAt: new Date() })
  await sendOTPEmail({ to: email, name: record.name, otp })
  return { email }
}

/* ── Login ── */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const e = new Error('Invalid email or password.'); e.statusCode = 401; throw e
  }
  return { user, token: signToken(user._id) }
}

/* ── Forgot Password ── */
const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email })
  // Always return success to prevent email enumeration
  if (!user) return { message: 'If this email exists, a reset link has been sent.' }

  const { raw, hashed } = generateResetToken()
  user.resetPasswordToken  = hashed
  user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000) // 15 min
  await user.save({ validateBeforeSave: false })

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password?token=${raw}&email=${encodeURIComponent(email)}`
  await sendPasswordResetEmail({ to: email, name: user.name, resetUrl })
  return { message: 'If this email exists, a reset link has been sent.' }
}

/* ── Reset Password ── */
const resetPassword = async ({ email, token, newPassword }) => {
  const { valid, errors } = validatePassword(newPassword)
  if (!valid) { const e = new Error(errors[0]); e.statusCode = 400; e.allErrors = errors; throw e }

  const hashed = hashToken(token)
  const user   = await User.findOne({
    email,
    resetPasswordToken:  hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+password +resetPasswordToken +resetPasswordExpire')

  if (!user) { const e = new Error('Reset link is invalid or has expired. Please request a new one.'); e.statusCode = 400; throw e }

  user.password            = newPassword
  user.resetPasswordToken  = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  return { user, token: signToken(user._id) }
}

module.exports = { initiateRegister, verifyOTPAndRegister, resendOTP, login, forgotPassword, resetPassword }
