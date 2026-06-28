import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Eye, EyeOff, ArrowRight, Check, X, ShieldCheck, RefreshCw, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import useAuthStore from '../../stores/authStore.js'

/* ─── Password rules ─── */
const RULES = [
  { id: 'len',     label: 'At least 8 characters',             test: (p) => p.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',         test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',   label: 'One lowercase letter (a–z)',         test: (p) => /[a-z]/.test(p) },
  { id: 'number',  label: 'One number (0–9)',                   test: (p) => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$%^&*…)',  test: (p) => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(p) },
]

const getStrength = (p) => {
  if (!p) return 0
  return RULES.filter(r => r.test(p)).length
}

const STRENGTH_CONFIG = [
  { label: '',          color: 'var(--border-2)' },
  { label: 'Too weak',  color: '#EF4444'          },
  { label: 'Weak',      color: '#F97316'          },
  { label: 'Fair',      color: '#EAB308'          },
  { label: 'Good',      color: '#22C55E'          },
  { label: 'Strong 💪', color: '#10B981'          },
]

/* ─── Password strength bar ─── */
function StrengthBar({ password }) {
  const score = getStrength(password)
  const cfg   = STRENGTH_CONFIG[score]

  return (
    <div style={{ marginTop: '0.625rem' }}>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.375rem' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 99,
            background: i <= score ? cfg.color : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      {password && (
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: cfg.color, transition: 'color 0.3s' }}>
          {cfg.label}
        </p>
      )}
    </div>
  )
}

/* ─── Password rule checklist ─── */
function RuleList({ password }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.625rem' }}>
      {RULES.map(rule => {
        const ok = rule.test(password)
        return (
          <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              background: ok ? '#10B981' : 'var(--surface-2)',
              border: `1.5px solid ${ok ? '#10B981' : 'var(--border-2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}>
              {ok && <Check size={9} color="#fff" strokeWidth={3} />}
            </div>
            <span style={{ fontSize: '0.75rem', color: ok ? '#10B981' : 'var(--text-3)', transition: 'color 0.2s', fontWeight: ok ? 500 : 400 }}>
              {rule.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── OTP digit input ─── */
function OTPInput({ value, onChange }) {
  const digits = value.split('')

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const arr = digits.slice()
      arr[idx] = ''
      // Remove trailing empties
      while (arr.length > 0 && arr[arr.length - 1] === '') arr.pop()
      onChange(arr.join(''))
      if (idx > 0) {
        const prev = document.getElementById(`otp-${idx - 1}`)
        if (prev) prev.focus()
      }
      return
    }

    if (/^\d$/.test(e.key)) {
      const arr = Array(6).fill('')
      digits.forEach((d, i) => { arr[i] = d })
      arr[idx] = e.key
      onChange(arr.join('').slice(0, 6))
      if (idx < 5) {
        const next = document.getElementById(`otp-${idx + 1}`)
        if (next) { next.focus(); next.select() }
      }
    }

    e.preventDefault()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    const lastIdx = Math.min(pasted.length, 5)
    const el = document.getElementById(`otp-${lastIdx}`)
    if (el) el.focus()
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map(idx => (
        <input
          key={idx}
          id={`otp-${idx}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ''}
          onKeyDown={(e) => handleKey(e, idx)}
          onPaste={handlePaste}
          onChange={() => {}}
          onClick={(e) => e.target.select()}
          style={{
            width: 44, height: 52,
            textAlign: 'center',
            fontSize: '1.25rem', fontWeight: 700,
            border: `2px solid ${digits[idx] ? 'var(--brand)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            background: digits[idx] ? 'var(--brand-light)' : 'var(--surface-2)',
            color: digits[idx] ? 'var(--brand)' : 'var(--text-1)',
            outline: 'none',
            transition: 'all 0.15s',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,80,248,0.12)' }}
          onBlur={e  => { e.currentTarget.style.borderColor = digits[idx] ? 'var(--brand)' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
        />
      ))}
    </div>
  )
}

/* ─── Page ─── */
export default function SignupPage() {
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  // Step: 'form' | 'otp'
  const [step, setStep]           = useState('form')
  const [loading, setLoading]     = useState(false)
  const [showPass, setShowPass]   = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [pendingEmail, setPendingEmail] = useState('')
  const [otp, setOtp]             = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const allRulesPass = RULES.every(r => r.test(form.password))

  /* ── Step 1: Submit registration form ── */
  const handleRegister = async (e) => {
    e.preventDefault()

    // Client-side validation
    const errs = {}
    if (!form.name.trim())  errs.name     = 'Name is required'
    if (!form.email.trim()) errs.email    = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email'
    if (!allRulesPass)      errs.password = 'Password does not meet all requirements'

    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await api.post('/auth/register', form)
      setPendingEmail(form.email)
      setStep('otp')
      toast.success(`OTP sent to ${form.email}`)
      // Start resend cooldown 60s
      startCooldown()
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed'
      toast.error(msg)
      if (err.response?.data?.errors) {
        toast(err.response.data.errors.slice(1).join('\n'), { icon: '⚠️', duration: 5000 })
      }
    } finally { setLoading(false) }
  }

  /* ── Step 2: Verify OTP ── */
  const handleVerifyOTP = async (e) => {
    e?.preventDefault()
    if (otp.length !== 6) { toast.error('Enter all 6 digits'); return }

    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email: pendingEmail, otp })
      setAuth(res.data.data.user, res.data.data.token)
      toast.success('Email verified! Welcome to TaskFlow AI 🚀')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP')
      setOtp('')
      document.getElementById('otp-0')?.focus()
    } finally { setLoading(false) }
  }

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return
    try {
      await api.post('/auth/resend-otp', { email: pendingEmail })
      toast.success('New OTP sent!')
      setOtp('')
      startCooldown()
      document.getElementById('otp-0')?.focus()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend')
    }
  }

  const startCooldown = () => {
    setResendCooldown(60)
    const timer = setInterval(() => {
      setResendCooldown(c => {
        if (c <= 1) { clearInterval(timer); return 0 }
        return c - 1
      })
    }, 1000)
  }

  /* Auto-submit when 6 digits entered */
  const handleOTPChange = (val) => {
    setOtp(val)
    if (val.length === 6) setTimeout(() => handleVerifyOTP(), 120)
  }

  /* ─── shared field style ─── */
  const fs = {
    width: '100%', height: 42, padding: '0 0.875rem',
    background: 'var(--surface-2)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text-1)',
    fontSize: '0.9375rem', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color .15s, box-shadow .15s',
  }
  const onFocus = (e) => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,80,248,.12)' }
  const onBlur  = (e) => { e.currentTarget.style.borderColor = errors[e.currentTarget.name] ? '#EF4444' : 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }

  /* ─── Shared card wrapper ─── */
  const card = (children) => (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
      {/* BG orbs */}
      <div style={{ position: 'fixed', top: '-15%', right: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-5%', width: '35vw', height: '35vw', borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,80,248,.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem', marginBottom: '1.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,var(--brand),#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-brand)' }}>
            <Zap size={17} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>TaskFlow AI</span>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
          {children}
        </div>
      </motion.div>
    </div>
  )

  /* ══════════════════════════════
     STEP 1 — Registration form
  ══════════════════════════════ */
  if (step === 'form') {
    return card(
      <div style={{ padding: 'clamp(1.5rem,5vw,2rem)' }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em', marginBottom: '0.375rem' }}>
          Create your account
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginBottom: '1.5rem' }}>
          Already have an account?{' '}
          <Link to="/auth/login" style={{ color: 'var(--brand)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} noValidate>

          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.375rem' }}>Full name</label>
            <input name="name" placeholder="Alex Johnson" value={form.name} onChange={set('name')} onFocus={onFocus} onBlur={onBlur}
              style={{ ...fs, borderColor: errors.name ? '#EF4444' : 'var(--border)' }} />
            {errors.name && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.3rem' }}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.375rem' }}>Email address</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} onFocus={onFocus} onBlur={onBlur}
              style={{ ...fs, borderColor: errors.email ? '#EF4444' : 'var(--border)' }} />
            {errors.email && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.3rem' }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.375rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 chars with A-Z, a-z, 0-9, !@#…"
                value={form.password}
                onChange={set('password')}
                onFocus={(e) => { setShowRules(true); onFocus(e) }}
                onBlur={(e) => { onBlur(e) }}
                style={{ ...fs, paddingRight: '2.5rem', borderColor: errors.password ? '#EF4444' : 'var(--border)' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', display: 'flex', padding: 0 }}>
                {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && <StrengthBar password={form.password} />}

            {/* Rules checklist */}
            <AnimatePresence>
              {(showRules || form.password) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ marginTop: '0.75rem', padding: '0.875rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      Password requirements
                    </p>
                    <RuleList password={form.password} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.password && <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.3rem' }}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !allRulesPass}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem', opacity: (!allRulesPass && form.password) ? 0.5 : 1 }}
          >
            {loading
              ? 'Sending OTP…'
              : <><span>Continue</span><ArrowRight size={16}/></>
            }
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.5 }}>
            By creating an account you agree to our{' '}
            <a href="#" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Terms</a>{' '}
            and{' '}
            <a href="#" style={{ color: 'var(--brand)', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </form>
      </div>
    )
  }

  /* ══════════════════════════════
     STEP 2 — OTP Verification
  ══════════════════════════════ */
  return card(
    <div>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => { setStep('form'); setOtp('') }} className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--text-3)', flexShrink: 0 }}>
          <ChevronLeft size={16}/>
        </button>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-1)' }}>Verify your email</span>
      </div>

      <div style={{ padding: 'clamp(1.5rem,5vw,2rem)' }}>
        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg,var(--brand),#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: 'var(--shadow-brand)' }}>
          <ShieldCheck size={26} color="#fff" />
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-1)', textAlign: 'center', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Check your inbox
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', textAlign: 'center', lineHeight: 1.65, marginBottom: '2rem' }}>
          We sent a 6-digit code to<br/>
          <strong style={{ color: 'var(--text-1)' }}>{pendingEmail}</strong>
        </p>

        {/* OTP input */}
        <OTPInput value={otp} onChange={handleOTPChange} />

        {/* Submit button */}
        <button
          onClick={handleVerifyOTP}
          disabled={loading || otp.length !== 6}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginTop: '1.5rem' }}
        >
          {loading
            ? 'Verifying…'
            : <><Check size={16}/> Verify email</>
          }
        </button>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resendCooldown > 0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
              background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
              color: resendCooldown > 0 ? 'var(--text-3)' : 'var(--brand)',
              fontSize: '0.875rem', fontWeight: 600, fontFamily: 'inherit',
              padding: 0,
              opacity: resendCooldown > 0 ? 0.6 : 1,
            }}
          >
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
          </button>
        </div>

        {/* Tip */}
        <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>💡</span>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', lineHeight: 1.55 }}>
            Check your spam folder if you don't see the email. The code expires in <strong style={{ color: 'var(--text-2)' }}>10 minutes</strong>.
          </p>
        </div>
      </div>
    </div>
  )
}
