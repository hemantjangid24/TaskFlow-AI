import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, KeyRound, Check, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import useAuthStore from '../../stores/authStore.js'

const RULES = [
  { id:'len',     label:'At least 8 characters',      test: p => p.length >= 8 },
  { id:'upper',   label:'One uppercase letter (A–Z)',  test: p => /[A-Z]/.test(p) },
  { id:'lower',   label:'One lowercase letter (a–z)',  test: p => /[a-z]/.test(p) },
  { id:'number',  label:'One number (0–9)',            test: p => /[0-9]/.test(p) },
  { id:'special', label:'One special character',       test: p => /[!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|`~]/.test(p) },
]

const getScore = p => RULES.filter(r => r.test(p)).length
const STRENGTH = ['','Too weak','Weak','Fair','Good','Strong 💪']
const STR_CLR  = ['','#EF4444','#F97316','#EAB308','#22C55E','#10B981']

export default function ResetPasswordPage() {
  const [params]    = useSearchParams()
  const navigate    = useNavigate()
  const { setAuth } = useAuthStore()

  const token = params.get('token')  || ''
  const email = params.get('email')  || ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [errors,    setErrors]    = useState({})

  useEffect(() => {
    if (!token || !email) navigate('/auth/forgot-password', { replace: true })
  }, [token, email])

  const allPass   = RULES.every(r => r.test(password))
  const score     = getScore(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!allPass)              errs.password = 'Password does not meet all requirements'
    if (password !== confirm)  errs.confirm  = 'Passwords do not match'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await api.post('/auth/reset-password', { email, token, newPassword: password })
      setDone(true)
      toast.success('Password reset successfully!')
      setTimeout(() => navigate('/auth/login'), 2500)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed. Please request a new link.')
    } finally { setLoading(false) }
  }

  const fs = { width:'100%', height:42, padding:'0 2.5rem 0 0.875rem', background:'var(--surface-2)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text-1)', fontSize:'0.9375rem', fontFamily:'inherit', outline:'none', transition:'border-color .15s' }

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'1rem', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:'-10%', right:'-10%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', left:'-5%', width:'35vw', height:'35vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,80,248,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}
        style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem', marginBottom:'1.75rem' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--brand),#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-brand)' }}>
            <Zap size={17} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.02em' }}>TaskFlow AI</span>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-md)', overflow:'hidden' }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:28, height:28, borderRadius:'var(--radius-sm)', background:'var(--brand-light)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <KeyRound size={14} style={{ color:'var(--brand)' }}/>
            </div>
            <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-1)' }}>Set new password</span>
          </div>

          <div style={{ padding:'clamp(1.5rem,5vw,2rem)' }}>
            {!done ? (
              <>
                <p style={{ fontSize:'0.875rem', color:'var(--text-3)', marginBottom:'1.5rem', lineHeight:1.65 }}>
                  Resetting password for <strong style={{ color:'var(--text-1)' }}>{email}</strong>
                </p>

                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
                  {/* New password */}
                  <div>
                    <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.375rem' }}>New password</label>
                    <div style={{ position:'relative' }}>
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Min. 8 characters"
                        value={password}
                        onChange={e => { setPassword(e.target.value); setErrors(err => ({...err, password:''})) }}
                        style={{ ...fs, borderColor: errors.password ? '#EF4444' : 'var(--border)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                        onBlur={e  => e.currentTarget.style.borderColor = errors.password ? '#EF4444' : 'var(--border)'}
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:0 }}>
                        {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                    {errors.password && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.3rem' }}>{errors.password}</p>}

                    {/* Strength bar */}
                    {password && (
                      <div style={{ marginTop:'0.625rem' }}>
                        <div style={{ display:'flex', gap:'0.25rem', marginBottom:'0.375rem' }}>
                          {[1,2,3,4,5].map(i => (
                            <div key={i} style={{ flex:1, height:4, borderRadius:99, background: i <= score ? STR_CLR[score] : 'var(--border)', transition:'background .3s' }}/>
                          ))}
                        </div>
                        <p style={{ fontSize:'0.6875rem', fontWeight:600, color: STR_CLR[score] }}>{STRENGTH[score]}</p>
                      </div>
                    )}

                    {/* Rules */}
                    {password && (
                      <div style={{ marginTop:'0.75rem', padding:'0.875rem', background:'var(--surface-2)', borderRadius:'var(--radius)', border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'0.375rem' }}>
                        {RULES.map(rule => {
                          const ok = rule.test(password)
                          return (
                            <div key={rule.id} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                              <div style={{ width:16, height:16, borderRadius:'50%', background: ok ? '#10B981' : 'var(--surface-2)', border:`1.5px solid ${ok ? '#10B981' : 'var(--border-2)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
                                {ok && <Check size={9} color="#fff" strokeWidth={3}/>}
                              </div>
                              <span style={{ fontSize:'0.75rem', color: ok ? '#10B981' : 'var(--text-3)', fontWeight: ok ? 500 : 400 }}>{rule.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.375rem' }}>Confirm new password</label>
                    <div style={{ position:'relative' }}>
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Repeat your new password"
                        value={confirm}
                        onChange={e => { setConfirm(e.target.value); setErrors(err => ({...err, confirm:''})) }}
                        style={{ ...fs, borderColor: errors.confirm ? '#EF4444' : (confirm && confirm === password) ? '#10B981' : 'var(--border)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                        onBlur={e  => e.currentTarget.style.borderColor = errors.confirm ? '#EF4444' : (confirm && confirm === password) ? '#10B981' : 'var(--border)'}
                      />
                      {confirm && confirm === password && (
                        <Check size={14} strokeWidth={3} style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'#10B981' }}/>
                      )}
                    </div>
                    {errors.confirm && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.3rem' }}>{errors.confirm}</p>}
                  </div>

                  <button type="submit" disabled={loading || !allPass} className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginTop:'0.25rem' }}>
                    {loading ? 'Resetting…' : 'Reset password'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'#F0FDF4', border:'2px solid #86EFAC', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
                  <CheckCircle2 size={28} style={{ color:'#10B981' }}/>
                </div>
                <h2 style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--text-1)', marginBottom:'0.5rem' }}>Password reset!</h2>
                <p style={{ fontSize:'0.875rem', color:'var(--text-3)', marginBottom:'1.25rem' }}>Redirecting you to sign in…</p>
                <Link to="/auth/login" className="btn btn-primary" style={{ justifyContent:'center' }}>Go to sign in</Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
