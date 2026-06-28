import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim())              { setError('Email is required');        return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email'); return }
    setError(''); setLoading(true)
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const fs = { width:'100%', height:42, padding:'0 0.875rem 0 2.5rem', background:'var(--surface-2)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text-1)', fontSize:'0.9375rem', fontFamily:'inherit', outline:'none', transition:'border-color .15s' }

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'1rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:'-15%', left:'-10%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,80,248,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-15%', right:'-5%', width:'35vw', height:'35vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}
        style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem', marginBottom:'1.75rem' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--brand),#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-brand)' }}>
            <Zap size={17} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.02em' }}>TaskFlow AI</span>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', boxShadow:'var(--shadow-md)', overflow:'hidden' }}>

          {/* Back link */}
          <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <Link to="/auth/login" className="btn btn-ghost btn-icon btn-sm" style={{ color:'var(--text-3)' }}>
              <ArrowLeft size={15}/>
            </Link>
            <span style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-1)' }}>Forgot password</span>
          </div>

          <div style={{ padding:'clamp(1.5rem,5vw,2rem)' }}>
            {!sent ? (
              <>
                {/* Icon */}
                <div style={{ width:52, height:52, borderRadius:14, background:'var(--brand-light)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                  <Mail size={24} style={{ color:'var(--brand)' }}/>
                </div>
                <h1 style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.025em', marginBottom:'0.5rem' }}>Reset your password</h1>
                <p style={{ fontSize:'0.875rem', color:'var(--text-3)', marginBottom:'1.5rem', lineHeight:1.65 }}>
                  Enter your email and we'll send you a link to reset your password. The link expires in 15 minutes.
                </p>

                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
                  <div>
                    <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.375rem' }}>Email address</label>
                    <div style={{ position:'relative' }}>
                      <Mail size={14} style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', pointerEvents:'none' }}/>
                      <input
                        type="email" placeholder="you@example.com"
                        value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                        style={{ ...fs, borderColor: error ? '#EF4444' : 'var(--border)' }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                        onBlur={e  => e.currentTarget.style.borderColor = error ? '#EF4444' : 'var(--border)'}
                        autoFocus
                      />
                    </div>
                    {error && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.3rem' }}>{error}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }}>
                    {loading ? 'Sending…' : <><span>Send reset link</span><ArrowRight size={16}/></>}
                  </button>
                </form>

                <p style={{ textAlign:'center', fontSize:'0.875rem', color:'var(--text-3)', marginTop:'1.5rem' }}>
                  Remember your password?{' '}
                  <Link to="/auth/login" style={{ color:'var(--brand)', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
                </p>
              </>
            ) : (
              /* Success state */
              <motion.div initial={{ opacity:0, scale:.97 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'1rem 0' }}>
                <div style={{ width:60, height:60, borderRadius:'50%', background:'#F0FDF4', border:'2px solid #86EFAC', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.25rem' }}>
                  <CheckCircle2 size={28} style={{ color:'#10B981' }}/>
                </div>
                <h2 style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--text-1)', marginBottom:'0.625rem' }}>Check your inbox</h2>
                <p style={{ fontSize:'0.875rem', color:'var(--text-3)', lineHeight:1.65, marginBottom:'1.5rem' }}>
                  If <strong style={{ color:'var(--text-1)' }}>{email}</strong> is registered, you'll receive a password reset link shortly.
                </p>
                <div style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'0.75rem 1rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span>💡</span>
                  <p style={{ fontSize:'0.75rem', color:'var(--text-3)', lineHeight:1.55, textAlign:'left' }}>
                    Check your spam folder if you don't see the email. The link expires in <strong style={{ color:'var(--text-2)' }}>15 minutes</strong>.
                  </p>
                </div>
                <button onClick={() => { setSent(false); setEmail('') }} className="btn btn-secondary" style={{ width:'100%', justifyContent:'center' }}>
                  Try a different email
                </button>
                <Link to="/auth/login" style={{ display:'block', textAlign:'center', fontSize:'0.875rem', color:'var(--brand)', fontWeight:600, textDecoration:'none', marginTop:'1rem' }}>
                  Back to sign in
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
