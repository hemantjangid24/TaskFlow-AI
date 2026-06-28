import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import useAuthStore from '../../stores/authStore.js'

export default function LoginPage() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', data)
      setAuth(res.data.data.user, res.data.data.token)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.error || 'Invalid email or password')
    } finally { setLoading(false) }
  }

  const fs = { width:'100%', height:42, padding:'0 0.875rem', background:'var(--surface-2)', border:'1.5px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text-1)', fontSize:'0.9375rem', fontFamily:'inherit', outline:'none', transition:'border-color .15s' }
  const focusHandler = e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(91,80,248,.12)' }
  const blurHandler  = e => { e.currentTarget.style.borderColor = 'var(--border)';  e.currentTarget.style.boxShadow = 'none' }

  return (
    <div style={{ minHeight:'100dvh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'1rem', overflow:'hidden' }}>
      <div style={{ position:'fixed', top:'-20%', left:'-10%', width:'50vw', height:'50vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,80,248,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-20%', right:'-10%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:.4 }}
        style={{ width:'100%', maxWidth:400, position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem', marginBottom:'1.75rem' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,var(--brand),#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-brand)' }}>
            <Zap size={17} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{ fontSize:'1rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.02em' }}>TaskFlow AI</span>
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', padding:'clamp(1.5rem,5vw,2rem)', boxShadow:'var(--shadow-md)' }}>
          <h1 style={{ fontSize:'1.375rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.025em', marginBottom:'0.375rem' }}>Welcome back</h1>
          <p style={{ fontSize:'0.875rem', color:'var(--text-3)', marginBottom:'1.75rem' }}>
            Don't have an account?{' '}
            <Link to="/auth/signup" style={{ color:'var(--brand)', fontWeight:600, textDecoration:'none' }}>Sign up free</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display:'flex', flexDirection:'column', gap:'1rem' }} noValidate>
            <div>
              <label style={{ display:'block', fontSize:'0.8125rem', fontWeight:500, color:'var(--text-2)', marginBottom:'0.375rem' }}>Email address</label>
              <input type="email" placeholder="you@example.com" autoFocus
                style={{ ...fs, borderColor: errors.email ? '#EF4444' : 'var(--border)' }}
                onFocus={focusHandler} onBlur={blurHandler}
                {...register('email', { required:'Email required', pattern:{ value:/^\S+@\S+\.\S+$/, message:'Invalid email' } })}
              />
              {errors.email && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.3rem' }}>{errors.email.message}</p>}
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.375rem' }}>
                <label style={{ fontSize:'0.8125rem', fontWeight:500, color:'var(--text-2)' }}>Password</label>
                <Link to="/auth/forgot-password" style={{ fontSize:'0.75rem', color:'var(--brand)', textDecoration:'none', fontWeight:500 }}>Forgot password?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••"
                  style={{ ...fs, paddingRight:'2.5rem', borderColor: errors.password ? '#EF4444' : 'var(--border)' }}
                  onFocus={focusHandler} onBlur={blurHandler}
                  {...register('password', { required:'Password required' })}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-3)', display:'flex', padding:0 }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p style={{ fontSize:'0.75rem', color:'#EF4444', marginTop:'0.3rem' }}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center', marginTop:'0.25rem' }}>
              {loading ? 'Signing in…' : <><span>Sign in</span><ArrowRight size={16}/></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
