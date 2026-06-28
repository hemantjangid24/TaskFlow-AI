import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, ArrowLeft, Home } from 'lucide-react'
import useAuthStore from '../stores/authStore.js'

export default function NotFoundPage() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div style={{ minHeight:'100dvh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:'2rem', textAlign:'center', overflow:'hidden' }}>
      {/* BG orbs */}
      <div style={{ position:'fixed', top:'-10%', left:'-10%', width:'40vw', height:'40vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(91,80,248,.08) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', right:'-5%', width:'35vw', height:'35vw', borderRadius:'50%', background:'radial-gradient(circle,rgba(168,85,247,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:.5 }}
        style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', maxWidth:480 }}
      >
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'2.5rem' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,var(--brand),#A855F7)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'var(--shadow-brand)' }}>
            <Zap size={15} color="#fff" strokeWidth={2.5}/>
          </div>
          <span style={{ fontSize:'0.9375rem', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.02em' }}>TaskFlow AI</span>
        </div>

        {/* 404 number */}
        <div style={{ position:'relative', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:'clamp(5rem,18vw,9rem)', fontWeight:900, letterSpacing:'-0.06em', lineHeight:1, background:'linear-gradient(135deg,var(--brand) 0%,#A855F7 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', userSelect:'none' }}>
            404
          </div>
          {/* floating elements */}
          <motion.div animate={{ y:[-6,6,-6] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
            style={{ position:'absolute', top:'10%', right:'-12%', width:36, height:36, borderRadius:'var(--radius)', background:'var(--brand-light)', border:'1px solid rgba(91,80,248,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.125rem' }}>
            🚀
          </motion.div>
          <motion.div animate={{ y:[6,-6,6] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut', delay:.5 }}
            style={{ position:'absolute', bottom:'10%', left:'-8%', width:32, height:32, borderRadius:'var(--radius-sm)', background:'rgba(168,85,247,.1)', border:'1px solid rgba(168,85,247,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>
            ✨
          </motion.div>
        </div>

        <h1 style={{ fontSize:'clamp(1.375rem,4vw,1.875rem)', fontWeight:700, color:'var(--text-1)', letterSpacing:'-0.025em', marginBottom:'0.75rem' }}>
          Page not found
        </h1>
        <p style={{ fontSize:'1rem', color:'var(--text-3)', lineHeight:1.7, marginBottom:'2rem', maxWidth:360 }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap', justifyContent:'center' }}>
          <button onClick={() => window.history.back()} className="btn btn-secondary" style={{ gap:'0.4rem' }}>
            <ArrowLeft size={15}/> Go back
          </button>
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="btn btn-primary" style={{ gap:'0.4rem' }}>
            <Home size={15}/> {isAuthenticated ? 'Dashboard' : 'Home'}
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ marginTop:'2.5rem', padding:'1rem 1.5rem', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-sm)' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-3)', letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.75rem' }}>Quick links</p>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', justifyContent:'center' }}>
            {(isAuthenticated
              ? [{ to:'/dashboard', label:'Dashboard' },{ to:'/boards', label:'Boards' },{ to:'/settings', label:'Settings' }]
              : [{ to:'/', label:'Home' },{ to:'/auth/login', label:'Sign in' },{ to:'/auth/signup', label:'Sign up' }]
            ).map(({ to, label }) => (
              <Link key={to} to={to} style={{ fontSize:'0.8125rem', color:'var(--brand)', fontWeight:500, textDecoration:'none', padding:'0.375rem 0.75rem', background:'var(--brand-light)', borderRadius:'var(--radius-sm)', transition:'opacity .15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
