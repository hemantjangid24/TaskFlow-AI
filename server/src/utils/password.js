/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one digit (0-9)
 * - At least one special character (!@#$%^&* etc.)
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

const validatePassword = (password) => {
  const errors = []

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)')
  }
  if (!/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&* etc.)')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Get password strength score 0–4
 */
const getPasswordStrength = (password) => {
  let score = 0
  if (!password) return score
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(password)) score++
  return Math.min(score, 4)
}

/**
 * Generate a 6-digit numeric OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

module.exports = { validatePassword, getPasswordStrength, generateOTP }
