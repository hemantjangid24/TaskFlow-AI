const crypto = require('crypto')

const generateResetToken = () => {
  const raw   = crypto.randomBytes(32).toString('hex')
  const hashed = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, hashed }
}

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex')

module.exports = { generateResetToken, hashToken }
