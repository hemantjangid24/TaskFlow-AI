const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:  { type: String, required: [true,'Name required'], trim: true, maxlength: 60 },
  email: { type: String, required: [true,'Email required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/,'Invalid email'] },
  password: { type: String, required: [true,'Password required'], select: false },
  avatar: { type: String, default: '' },
  role:   { type: String, enum: ['user','admin'], default: 'user' },
  preferences: {
    theme:         { type: String, enum: ['light','dark','system'], default: 'light' },
    notifications: { email: { type: Boolean, default: true }, inApp: { type: Boolean, default: true } },
  },
  resetPasswordToken:  { type: String, select: false },
  resetPasswordExpire: { type: Date,   select: false },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.$skipPasswordHash) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (c) { return bcrypt.compare(c, this.password) }
userSchema.methods.toJSON = function () {
  const o = this.toObject()
  delete o.password; delete o.resetPasswordToken; delete o.resetPasswordExpire
  return o
}

module.exports = mongoose.model('User', userSchema)
