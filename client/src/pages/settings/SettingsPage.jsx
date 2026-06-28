import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Sun, Moon, Monitor, Bell, Shield, Palette, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import useUIStore from '../../stores/uiStore.js'
import useAuthStore from '../../stores/authStore.js'

/* ─── Section wrapper ─── */
function Section({ icon: Icon, title, description, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card"
      style={{ padding: '1.375rem' }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.625rem',
        marginBottom: '1.25rem', paddingBottom: '0.875rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          width: 32, height: 32, background: 'var(--brand-light)',
          borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon size={15} style={{ color: 'var(--brand)' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{title}</h2>
          {description && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 1 }}>{description}</p>}
        </div>
      </div>
      {children}
    </motion.div>
  )
}

/* ─── Toggle row ─── */
function Toggle({ label, description, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 0', borderBottom: '1px solid var(--border)',
      gap: '1rem',
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>{label}</p>
        {description && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 2 }}>{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative', width: 40, height: 22, borderRadius: 99,
          background: checked ? 'var(--brand)' : 'var(--border-2)',
          border: 'none', cursor: 'pointer',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
        aria-checked={checked}
        role="switch"
      >
        <span style={{
          position: 'absolute', top: 2,
          left: checked ? 20 : 2,
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,.2)',
          transition: 'left 0.2s cubic-bezier(.4,0,.2,1)',
        }} />
      </button>
    </div>
  )
}

/* ─── Theme option button ─── */
function ThemeOption({ value, icon: Icon, label, desc, current, onSelect }) {
  const active = current === value
  return (
    <button
      onClick={() => onSelect(value)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        padding: '1rem 0.75rem', borderRadius: 'var(--radius-lg)',
        border: `2px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
        background: active ? 'var(--brand-light)' : 'var(--surface-2)',
        cursor: 'pointer', transition: 'all 0.15s',
        width: '100%',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.background = 'var(--surface)' } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)';   e.currentTarget.style.background = 'var(--surface-2)' } }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 'var(--radius)',
        background: active ? 'var(--brand)' : 'var(--surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
        boxShadow: active ? 'var(--shadow-brand)' : 'var(--shadow-sm)',
      }}>
        <Icon size={18} style={{ color: active ? '#fff' : 'var(--text-3)' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: active ? 'var(--brand)' : 'var(--text-1)', lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: 2 }}>{desc}</p>
      </div>
    </button>
  )
}

/* ─── Page ─── */
export default function SettingsPage() {
  const { theme, setTheme } = useUIStore()
  const { user, updateUser } = useAuthStore()

  const [notifs, setNotifs] = useState({
    email: user?.preferences?.notifications?.email ?? true,
    inApp: user?.preferences?.notifications?.inApp ?? true,
  })

  const saveMut = useMutation({
    mutationFn: (prefs) => api.patch('/user/me', { preferences: prefs }),
    onSuccess: (res) => { updateUser(res.data.data.user); toast.success('Settings saved') },
    onError:   ()    => toast.error('Failed to save settings'),
  })

  const handleNotif = (key, val) => {
    const updated = { ...notifs, [key]: val }
    setNotifs(updated)
    saveMut.mutate({ notifications: updated })
  }

  const THEMES = [
    { value: 'light',  icon: Sun,     label: 'Light',  desc: 'Clean & bright'     },
    { value: 'dark',   icon: Moon,    label: 'Dark',   desc: 'Easy on the eyes'   },
    { value: 'system', icon: Monitor, label: 'System', desc: 'Follows your OS'    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 600 }}>

      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.025em' }}>Settings</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>
          Manage your preferences and account settings
        </p>
      </motion.div>

      {/* ── Appearance ── */}
      <Section icon={Palette} title="Appearance" description="Choose your preferred colour scheme" delay={0.05}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '0.875rem' }}>
          {THEMES.map(t => (
            <ThemeOption key={t.value} {...t} current={theme} onSelect={setTheme} />
          ))}
        </div>

        {/* Live preview strip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.625rem',
          padding: '0.625rem 0.875rem',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: theme === 'dark' ? '#818CF8' : theme === 'system' ? '#10B981' : '#F59E0B' }} />
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
            Active theme: <strong style={{ color: 'var(--text-1)', textTransform: 'capitalize' }}>{theme}</strong>
            {theme === 'system' && ' — follows your operating system'}
          </p>
        </div>

        {/* Quick toggle */}
        <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Quick switch</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { v: 'light',  Icon: Sun,     label: 'Light'  },
              { v: 'dark',   Icon: Moon,    label: 'Dark'   },
              { v: 'system', Icon: Monitor, label: 'System' },
            ].map(({ v, Icon, label }) => (
              <button
                key={v}
                onClick={() => setTheme(v)}
                className={`btn btn-sm ${theme === v ? 'btn-primary' : 'btn-secondary'}`}
                style={{ gap: '0.3rem' }}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title="Notifications" description="Control how you receive updates" delay={0.10}>
        <Toggle
          label="Email notifications"
          description="Get task updates and digests in your inbox"
          checked={notifs.email}
          onChange={(v) => handleNotif('email', v)}
        />
        <Toggle
          label="In-app notifications"
          description="Show alert badges and popups inside TaskFlow AI"
          checked={notifs.inApp}
          onChange={(v) => handleNotif('inApp', v)}
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', paddingTop: '0.75rem' }}>
          Changes are saved automatically.
        </p>
      </Section>

      {/* ── Account ── */}
      <Section icon={Shield} title="Account" description="Your account details and data" delay={0.15}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {[
            { label: 'Account ID',    value: user?._id,  mono: true },
            { label: 'Email',         value: user?.email },
            { label: 'Member since',  value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
            { label: 'Plan',          value: 'Free' },
          ].map(({ label, value, mono }) => (
            <div key={label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.75rem', background: 'var(--surface-2)',
              borderRadius: 'var(--radius)', gap: '0.75rem',
            }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-2)', fontWeight: 500, flexShrink: 0 }}>{label}</span>
              <span style={{
                fontSize: mono ? '0.6875rem' : '0.8125rem',
                color: 'var(--text-1)',
                fontFamily: mono ? 'monospace' : 'inherit',
                fontWeight: 500,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0,
              }}>
                {value || '—'}
              </span>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#EF4444', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.625rem' }}>
            Danger zone
          </p>
          <button
            className="btn btn-sm"
            onClick={() => toast.error('Account deletion is disabled in this demo.')}
            style={{
              background: 'rgba(239,68,68,0.08)', color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.25)', gap: '0.375rem',
            }}
          >
            <Trash2 size={12} /> Delete account
          </button>
        </div>
      </Section>
    </div>
  )
}
