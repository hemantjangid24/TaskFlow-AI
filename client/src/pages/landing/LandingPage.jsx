import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Zap, ArrowRight, Check, Star, Sparkles, LayoutDashboard,
  Menu, X, Kanban, Bell, BarChart3, Clock, Shield, Cpu, Sun, Moon
} from 'lucide-react'
import useUIStore from '../../stores/uiStore.js'

/* ─── animation helpers ─── */
const fade = (d = 0) => ({ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: .55, delay: d, ease: [.22, 1, .36, 1] } })
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5, delay: d, ease: [.22, 1, .36, 1] } })

/* ─── data ─── */
const FEATURES = [
  { icon: Kanban, col: '#5B50F8', title: 'Kanban Boards', desc: 'Drag-and-drop boards with four columns — Todo, In Progress, Review, Done. Visual workflow for any team size.' },
  { icon: Sparkles, col: '#A855F7', title: 'AI Task Assistant', desc: 'Gemini AI estimates effort hours, recommends due dates, sets priority, and explains its reasoning in seconds.' },
  { icon: BarChart3, col: '#06B6D4', title: 'Analytics Dashboard', desc: 'Track completed tasks, overdue items, and team velocity with beautiful charts updated in real time.' },
  { icon: Clock, col: '#F97316', title: 'Activity Timeline', desc: 'Full audit log of every change across all boards. Know exactly who did what and when.' },
  { icon: Shield, col: '#10B981', title: 'Secure by Default', desc: 'JWT auth, bcrypt hashing, rate limiting, CORS and Helmet.js — enterprise-grade security from day one.' },
  { icon: Bell, col: '#EF4444', title: 'Smart Notifications', desc: 'In-app and email alerts for due tasks, team activity, and AI suggestions — fully configurable.' },
]
const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Startup Founder', rating: 5, text: 'TaskFlow AI replaced three separate tools. The Gemini AI estimates alone save our team two hours every sprint planning session.' },
  { name: 'Rajan M.', role: 'Senior Engineer', rating: 5, text: "Cleanest kanban UI I've used — as polished as Linear but with AI baked right in. Genuinely impressive." },
  { name: 'Sarah K.', role: 'Product Lead', rating: 5, text: 'Onboarded my whole team in under 10 minutes. The dashboard analytics give me exactly the insights I need.' },
]
const PLANS = [
  { name: 'Free', price: '0', period: null, hl: false, features: ['3 boards', '50 tasks per board', 'Basic analytics', 'Community support'], cta: 'Get started free' },
  { name: 'Pro', price: '12', period: '/mo', hl: true, features: ['Unlimited boards', 'Unlimited tasks', 'AI task assistant', 'Advanced analytics', 'Priority support'], cta: 'Start 14-day trial' },
  { name: 'Team', price: '39', period: '/mo', hl: false, features: ['Everything in Pro', 'Up to 10 members', 'Shared boards', 'Team analytics', 'Dedicated support'], cta: 'Contact sales' },
]
const STATS = [
  { v: '10k+', l: 'Active users' },
  { v: '500k+', l: 'Tasks managed' },
  { v: '98%', l: 'Uptime SLA' },
  { v: '4.9★', l: 'Average rating' },
]

/* ─── Navbar ─── */
function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="lp-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.88)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(228,230,239,0.8)',
      transition: 'background .3s',
    }}>
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#5B50F8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(91,80,248,.35)' }}>
            <Zap size={15} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="lp-text-head" style={{ fontWeight: 700, fontSize: 15, color: '#0F1320', letterSpacing: '-0.02em' }}>
            TaskFlow <span style={{ color: '#5B50F8' }}>AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="lp-desktop-nav">
          {['Features', 'Pricing', 'Testimonials'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="lp-nav-link"
              style={{ fontSize: 14, fontWeight: 500, color: '#4B5168', textDecoration: 'none', transition: 'color .15s' }}>
              {l}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="lp-desktop-nav">
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            style={{ width: 36, height: 36, borderRadius: 9, background: 'transparent', border: '1.5px solid #E4E6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .15s', color: '#4B5168', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#5B50F8'; e.currentTarget.style.color = '#5B50F8' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E6EF'; e.currentTarget.style.color = '#4B5168' }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <Link to="/auth/login" className="lp-text-body" style={{ fontSize: 14, fontWeight: 500, color: '#4B5168', textDecoration: 'none', padding: '6px 14px' }}>
            Sign in
          </Link>
          <Link to="/auth/signup" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#5B50F8', padding: '7px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 2px 8px rgba(91,80,248,.35)', transition: 'background .15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#4338CA'}
            onMouseLeave={e => e.currentTarget.style.background = '#5B50F8'}>
            Get started
          </Link>
        </div>

        {/* Mobile: theme + hamburger */}
        <div style={{ display: 'none', alignItems: 'center', gap: 8 }} className="lp-mobile-actions">
          <button onClick={toggleTheme}
            style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: '1.5px solid #E4E6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#4B5168' }}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button onClick={() => setOpen(!open)}
            style={{ width: 34, height: 34, borderRadius: 8, background: 'transparent', border: '1.5px solid #E4E6EF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#0F1320' }}>
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lp-nav-mobile-menu" style={{ background: '#fff', borderTop: '1px solid #E4E6EF', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Features', 'Pricing', 'Testimonials'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="lp-mobile-link"
              style={{ fontSize: 15, fontWeight: 500, color: '#0F1320', textDecoration: 'none' }}>{l}
            </a>
          ))}
          <div className="lp-divider" style={{ height: 1, background: '#E4E6EF' }} />
          <Link to="/auth/login" onClick={() => setOpen(false)} className="lp-mobile-link" style={{ fontSize: 15, fontWeight: 500, color: '#4B5168', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/auth/signup" onClick={() => setOpen(false)} style={{ fontSize: 15, fontWeight: 600, color: '#fff', background: '#5B50F8', padding: '12px 20px', borderRadius: 10, textDecoration: 'none', textAlign: 'center' }}>
            Get started free
          </Link>
        </div>
      )}

      <style>{`
        @media (max-width:680px) {
          .lp-desktop-nav   { display:none !important; }
          .lp-mobile-actions{ display:flex !important; }
        }
      `}</style>
    </nav>
  )
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section className="lp-hero" style={{ paddingTop: 120, paddingBottom: 80, textAlign: 'center', background: 'linear-gradient(180deg,#F0F1FF 0%,#F7F8FC 60%)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(91,80,248,.10) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '5%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,.09) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <motion.div {...fadeUp(0)}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#EEF0FF', border: '1px solid rgba(91,80,248,.2)', borderRadius: 99, padding: '5px 14px 5px 10px', marginBottom: 28 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#5B50F8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={11} color="#fff" />
            </div>
            <span className="lp-text-brand" style={{ fontSize: 13, fontWeight: 600, color: '#5B50F8' }}>Powered by Google Gemini AI</span>
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(.08)} className="lp-text-head" style={{ fontSize: 'clamp(2.25rem,6vw,4rem)', fontWeight: 800, color: '#0F1320', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 22 }}>
          Project management{' '}
          <span style={{ background: 'linear-gradient(135deg,#5B50F8 0%,#A855F7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            supercharged by AI
          </span>
        </motion.h1>

        <motion.p {...fadeUp(.14)} className="lp-text-body" style={{ fontSize: 'clamp(1rem,2.5vw,1.2rem)', color: '#4B5168', lineHeight: 1.7, marginBottom: 36, maxWidth: 580, margin: '0 auto 36px' }}>
          TaskFlow AI combines the best of Trello, Linear, and Notion — with an intelligent assistant that estimates effort, sets priorities, and keeps every deadline in check.
        </motion.p>

        <motion.div {...fadeUp(.2)} style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#5B50F8', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 16px rgba(91,80,248,.38)', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4338CA'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#5B50F8'; e.currentTarget.style.transform = 'translateY(0)' }}>
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/auth/login" className="lp-text-head" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#0F1320', fontWeight: 600, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none', border: '1.5px solid #E4E6EF', transition: 'all .15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#5B50F8'; e.currentTarget.style.color = '#5B50F8' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E6EF'; e.currentTarget.style.color = 'inherit' }}>
            View demo
          </Link>
        </motion.div>

        <motion.p {...fadeUp(.26)} className="lp-text-muted" style={{ fontSize: 13, color: '#8B91A8', marginTop: 18 }}>
          No credit card required · Free forever plan available
        </motion.p>
      </div>
    </section>
  )
}

/* ─── App Preview ─── */
function AppPreview() {
  const cols = [
    { label: 'Todo', dot: '#8B91A8', cards: [{ t: 'Design onboarding flow', p: 'High', bc: '#FFF7ED', tc: '#C2410C' }, { t: 'Fix auth redirect bug', p: 'Urgent', bc: '#FEF2F2', tc: '#B91C1C' }] },
    { label: 'In Progress', dot: '#3B82F6', cards: [{ t: 'Build AI suggestion API', p: 'High', bc: '#FFF7ED', tc: '#C2410C' }, { t: 'Write documentation', p: 'Medium', bc: '#FEFCE8', tc: '#854D0E' }] },
    { label: 'In Review', dot: '#8B5CF6', cards: [{ t: 'Dashboard charts', p: 'Medium', bc: '#FEFCE8', tc: '#854D0E' }] },
    { label: 'Done', dot: '#10B981', cards: [{ t: 'Setup DB schemas', p: 'Low', bc: '#F0FDF4', tc: '#15803D' }, { t: 'Configure JWT auth', p: 'High', bc: '#FFF7ED', tc: '#C2410C' }] },
  ]
  return (
    <section style={{ padding: '0 20px 80px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1120, margin: '0 auto' }}>
        <motion.div {...fade(0)} className="lp-preview-wrap" style={{
          background: '#fff', borderRadius: 20, border: '1px solid #E4E6EF',
          boxShadow: '0 20px 60px rgba(0,0,0,.10),0 4px 16px rgba(0,0,0,.06)', overflow: 'hidden',
        }}>
          {/* Browser chrome */}
          <div className="lp-preview-chrome" style={{ background: '#F7F8FC', borderBottom: '1px solid #E4E6EF', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6 }}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            </div>
            <div className="lp-preview-url" style={{ flex: 1, background: '#fff', borderRadius: 6, height: 24, maxWidth: 280, margin: '0 auto', border: '1px solid #E4E6EF', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span className="lp-text-muted" style={{ fontSize: 11, color: '#8B91A8' }}>app.taskflow.ai/boards/sprint-12/kanban</span>
            </div>
          </div>

          {/* Shell */}
          <div style={{ display: 'flex', minHeight: 340 }}>
            {/* Sidebar */}
            <div className="lp-preview-sidebar preview-sidebar-hide" style={{ width: 180, background: '#FAFBFF', borderRight: '1px solid #E4E6EF', padding: '16px 12px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 24, height: 24, borderRadius: 7, background: 'linear-gradient(135deg,#5B50F8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={12} color="#fff" />
                </div>
                <span className="lp-text-head" style={{ fontSize: 12, fontWeight: 700, color: '#0F1320' }}>TaskFlow AI</span>
              </div>
              {[{ Icon: LayoutDashboard, l: 'Dashboard', a: false }, { Icon: Kanban, l: 'Boards', a: true }, { Icon: Bell, l: 'Notifications', a: false }].map(({ Icon, l, a }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 8, marginBottom: 2, background: a ? '#EEF0FF' : 'transparent' }}>
                  <Icon size={13} style={{ color: a ? '#5B50F8' : '#8B91A8' }} />
                  <span className={a ? 'lp-text-brand' : 'lp-text-label'} style={{ fontSize: 12, fontWeight: a ? 600 : 500, color: a ? '#5B50F8' : '#4B5168' }}>{l}</span>
                </div>
              ))}
            </div>

            {/* Kanban */}
            <div className="lp-preview-kanban" style={{ flex: 1, padding: '16px', overflowX: 'auto', background: '#F7F8FC' }}>
              <div style={{ display: 'flex', gap: 12, minWidth: 520 }}>
                {cols.map(col => (
                  <div key={col.label} style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
                      <span className="lp-text-label" style={{ fontSize: 10, fontWeight: 700, color: '#4B5168', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{col.label}</span>
                      <span className="lp-text-muted" style={{ fontSize: 10, background: '#E4E6EF', color: '#8B91A8', borderRadius: 99, padding: '1px 6px', fontWeight: 600 }}>{col.cards.length}</span>
                    </div>
                    <div className="lp-preview-col-bg" style={{ background: '#F1F2F7', borderRadius: 10, padding: 8, display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {col.cards.map((card, i) => (
                        <div key={i} className="lp-preview-card" style={{ background: '#fff', borderRadius: 8, padding: '9px 10px', border: '1px solid #E4E6EF', boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
                          <p className="lp-preview-task-title" style={{ fontSize: 11.5, fontWeight: 500, color: '#0F1320', lineHeight: 1.4, marginBottom: 7 }}>{card.t}</p>
                          <span style={{ fontSize: 10, fontWeight: 600, background: card.bc, color: card.tc, padding: '2px 7px', borderRadius: 99 }}>{card.p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
        <style>{`@media(max-width:600px){.preview-sidebar-hide{display:none!important}}`}</style>
      </div>
    </section>
  )
}

/* ─── Stats ─── */
function Stats() {
  return (
    <section className="lp-stats" style={{ padding: '60px 20px', background: '#fff', borderTop: '1px solid #E4E6EF', borderBottom: '1px solid #E4E6EF' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '32px 16px', textAlign: 'center' }}>
        {STATS.map(({ v, l }, i) => (
          <motion.div key={l} {...fade(i * .08)}>
            <div className="lp-stat-value" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: '#5B50F8', letterSpacing: '-0.04em', lineHeight: 1 }}>{v}</div>
            <div className="lp-stat-label" style={{ fontSize: 13, color: '#8B91A8', marginTop: 6, fontWeight: 500 }}>{l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ─── Features ─── */
function Features() {
  return (
    <section id="features" className="lp-features-section" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#F7F8FC' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div {...fade(0)} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="lp-text-brand" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5B50F8', background: '#EEF0FF', padding: '4px 14px', borderRadius: 99, marginBottom: 14 }}>Features</div>
          <h2 className="lp-text-head" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: '#0F1320', letterSpacing: '-0.035em', lineHeight: 1.2, marginBottom: 14 }}>
            Everything your team needs
          </h2>
          <p className="lp-text-body" style={{ fontSize: 'clamp(.9rem,2vw,1.05rem)', color: '#4B5168', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Built for startups, used by teams that move fast. No bloat — just the tools that matter.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
          {FEATURES.map(({ icon: Icon, col, title, desc }, i) => (
            <motion.div key={title} {...fade(i * .07)} className="lp-feature-card"
              style={{ background: '#fff', border: '1px solid #E4E6EF', borderRadius: 16, padding: '1.5rem', transition: 'box-shadow .2s,transform .2s,border-color .2s', cursor: 'default' }}
              whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(0,0,0,.10)', borderColor: '#D0D3E3' }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: col + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={21} style={{ color: col }} />
              </div>
              <h3 className="lp-text-head" style={{ fontSize: 16, fontWeight: 700, color: '#0F1320', letterSpacing: '-0.015em', marginBottom: 8 }}>{title}</h3>
              <p className="lp-text-body" style={{ fontSize: 14, color: '#4B5168', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── AI Showcase ─── */
function AIShowcase() {
  return (
    <section className="lp-ai-section" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#fff' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 48, alignItems: 'center' }}>
        <motion.div {...fade(0)}>
          <div className="lp-text-brand" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#A855F7', background: '#F5F3FF', padding: '4px 14px', borderRadius: 99, marginBottom: 18 }}>AI Assistant</div>
          <h2 className="lp-text-head" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.3rem)', fontWeight: 800, color: '#0F1320', letterSpacing: '-0.035em', lineHeight: 1.2, marginBottom: 16 }}>
            Let Gemini AI handle the guesswork
          </h2>
          <p className="lp-text-body" style={{ fontSize: 15, color: '#4B5168', lineHeight: 1.7, marginBottom: 24 }}>
            Click "Suggest Estimate" on any task and our AI instantly returns effort hours, a recommended due date, priority level, and clear reasoning — all in under 2 seconds.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Estimates realistic effort in hours', 'Recommends the best due date', 'Sets priority based on task context', 'Explains its reasoning clearly'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={11} style={{ color: '#5B50F8' }} strokeWidth={3} />
                </div>
                <span className="lp-text-head" style={{ fontSize: 14, color: '#0F1320', fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
          <Link to="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 28, background: '#5B50F8', color: '#fff', fontWeight: 600, fontSize: 14, padding: '11px 22px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 14px rgba(91,80,248,.35)' }}>
            Try AI for free <ArrowRight size={15} />
          </Link>
        </motion.div>

        <motion.div {...fade(.12)}>
          <div style={{ background: 'linear-gradient(135deg,#5B50F8 0%,#A855F7 100%)', borderRadius: 20, padding: 24, boxShadow: '0 20px 50px rgba(91,80,248,.30)' }}>
            <div style={{ background: 'rgba(255,255,255,.12)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 4, fontWeight: 500 }}>TASK</p>
              <p style={{ fontSize: 14, color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>Integrate Stripe payment gateway and handle webhooks</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={13} color="#fff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.9)', letterSpacing: '0.06em' }}>GEMINI AI SUGGESTION</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[{ l: 'Effort', v: '8 hours' }, { l: 'Due date', v: 'In 5 days' }, { l: 'Priority', v: 'High' }].map(({ l, v }) => (
                <div key={l} style={{ background: 'rgba(255,255,255,.12)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', marginBottom: 4, fontWeight: 500 }}>{l}</p>
                  <p style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(255,255,255,.10)', borderRadius: 10, padding: '10px 12px', borderLeft: '3px solid rgba(255,255,255,.3)' }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.8)', lineHeight: 1.55 }}>
                "Stripe integration requires webhook setup, error handling, and testing. 8 hours accounts for edge cases and security review."
              </p>
            </div>
            <button style={{ width: '100%', marginTop: 14, background: '#fff', color: '#5B50F8', fontWeight: 700, fontSize: 13, padding: 11, borderRadius: 10, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={14} strokeWidth={2.5} /> Apply suggestion
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── */
function Testimonials() {
  return (
    <section id="testimonials" className="lp-testimonials-section" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#F7F8FC' }}>
      <div style={{ maxWidth: 1060, margin: '0 auto' }}>
        <motion.div {...fade(0)} style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="lp-text-brand" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5B50F8', background: '#EEF0FF', padding: '4px 14px', borderRadius: 99, marginBottom: 14 }}>Testimonials</div>
          <h2 className="lp-text-head" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.3rem)', fontWeight: 800, color: '#0F1320', letterSpacing: '-0.035em' }}>Loved by teams</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem' }}>
          {TESTIMONIALS.map(({ name, role, rating, text }, i) => (
            <motion.div key={name} {...fade(i * .09)} className="lp-testimonial-card"
              style={{ background: '#fff', border: '1px solid #E4E6EF', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(rating)].map((_, j) => <Star key={j} size={14} style={{ color: '#F59E0B', fill: '#F59E0B' }} />)}
              </div>
              <p className="lp-text-head" style={{ fontSize: 14.5, color: '#0F1320', lineHeight: 1.7, flex: 1 }}>"{text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#5B50F8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{name[0]}</div>
                <div>
                  <p className="lp-text-head" style={{ fontSize: 13, fontWeight: 700, color: '#0F1320', lineHeight: 1 }}>{name}</p>
                  <p className="lp-text-muted" style={{ fontSize: 12, color: '#8B91A8', marginTop: 3 }}>{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing ─── */
function Pricing() {
  return (
    <section id="pricing" className="lp-pricing-section" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#fff' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <motion.div {...fade(0)} style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="lp-text-brand" style={{ display: 'inline-block', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5B50F8', background: '#EEF0FF', padding: '4px 14px', borderRadius: 99, marginBottom: 14 }}>Pricing</div>
          <h2 className="lp-text-head" style={{ fontSize: 'clamp(1.6rem,3.5vw,2.3rem)', fontWeight: 800, color: '#0F1320', letterSpacing: '-0.035em', marginBottom: 12 }}>Simple, transparent pricing</h2>
          <p className="lp-text-body" style={{ fontSize: 15, color: '#4B5168' }}>Start free. Upgrade when you need it. No hidden fees.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {PLANS.map(({ name, price, period, hl, features, cta }, i) => (
            <motion.div key={name} {...fade(i * .08)}
              className={hl ? 'lp-pricing-card-hl' : 'lp-pricing-card'}
              style={{ borderRadius: 18, border: hl ? '2px solid #5B50F8' : '1px solid #E4E6EF', background: hl ? '#5B50F8' : '#fff', padding: '1.75rem', position: 'relative', boxShadow: hl ? '0 16px 40px rgba(91,80,248,.28)' : '0 2px 8px rgba(0,0,0,.04)' }}>
              {hl && <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#A855F7', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 99, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <h3 className={hl ? '' : 'lp-plan-name'} style={{ fontSize: 18, fontWeight: 700, color: hl ? '#fff' : '#0F1320', marginBottom: 6 }}>{name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 13, color: hl ? 'rgba(255,255,255,.7)' : '#8B91A8', marginTop: 2 }}>$</span>
                <span className={hl ? '' : 'lp-plan-price'} style={{ fontSize: 38, fontWeight: 800, color: hl ? '#fff' : '#0F1320', letterSpacing: '-0.04em', lineHeight: 1 }}>{price}</span>
                {period && <span style={{ fontSize: 14, color: hl ? 'rgba(255,255,255,.6)' : '#8B91A8' }}>{period}</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: hl ? 'rgba(255,255,255,.2)' : '#EEF0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={10} style={{ color: hl ? '#fff' : '#5B50F8' }} strokeWidth={3} />
                    </div>
                    <span className={hl ? '' : 'lp-plan-feature'} style={{ fontSize: 14, color: hl ? 'rgba(255,255,255,.85)' : '#4B5168' }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link to="/auth/signup" className={hl ? '' : 'lp-plan-cta'}
                style={{ display: 'block', textAlign: 'center', padding: 12, borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', background: hl ? '#fff' : '#0F1320', color: hl ? '#5B50F8' : '#fff', transition: 'opacity .15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                {cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="lp-cta-section" style={{ padding: 'clamp(60px,8vw,100px) 20px', background: '#F7F8FC' }}>
      <motion.div {...fade(0)} style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg,#5B50F8 0%,#A855F7 100%)', borderRadius: 24, padding: 'clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,3rem)', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(91,80,248,.30)' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.05)', pointerEvents: 'none' }} />
          <Cpu size={36} style={{ color: 'rgba(255,255,255,.6)', marginBottom: 20 }} />
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.035em', lineHeight: 1.25, marginBottom: 14 }}>
            Ready to build smarter?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.75)', marginBottom: 32, lineHeight: 1.65 }}>
            Join thousands of teams shipping faster with AI-powered task management. Free forever, no credit card needed.
          </p>
          <Link to="/auth/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#5B50F8', fontWeight: 700, fontSize: 15, padding: '13px 28px', borderRadius: 12, textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.12)' }}>
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="lp-footer" style={{ background: '#0F1320', padding: 'clamp(40px,5vw,60px) 20px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '40px 32px', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#5B50F8,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={13} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="lp-footer-brand" style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>TaskFlow AI</span>
            </div>
            <p style={{ fontSize: 13, color: '#4B5168', lineHeight: 1.65 }}>AI-powered task management for teams that move fast.</p>
          </div>
          {[
            { heading: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { heading: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { heading: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>{heading}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(l => <a key={l} href="#" className="lp-footer-link" style={{ fontSize: 13, color: '#4B5168', textDecoration: 'none', transition: 'color .15s' }} onMouseEnter={e => e.currentTarget.style.color = '#8B91A8'} onMouseLeave={e => e.currentTarget.style.color = '#4B5168'}>{l}</a>)}
              </div>
            </div>
          ))}
        </div>
        <div
          className="lp-footer-divider"
          style={{
            borderTop: "1px solid #1C1F2E",
            paddingTop: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className="lp-footer-copy"
            style={{
              fontSize: 13,
              color: "#4B5168",
              margin: 0,
              textAlign: "center",
            }}
          >
            © 2026 TaskFlow AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Main export ─── */
export default function LandingPage() {
  const { theme, toggleTheme } = useUIStore()

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", color: '#0F1320', overflowX: 'hidden' }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <AppPreview />
      <Stats />
      <Features />
      <AIShowcase />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  )
}
