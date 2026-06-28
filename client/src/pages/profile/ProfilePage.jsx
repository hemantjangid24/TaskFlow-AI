import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { User, Lock, Palette, Shield, Mail, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import useAuthStore from '../../stores/authStore.js'
import { getInitials } from '../../lib/utils.js'

const COLORS = ['#5B50F8','#8B5CF6','#EC4899','#EF4444','#F97316','#10B981','#06B6D4','#3B82F6','#F59E0B','#84CC16']

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card" style={{ padding: '1.375rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ width: 32, height: 32, background: 'var(--brand-light)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={15} style={{ color: 'var(--brand)' }} />
        </div>
        <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{title}</h2>
      </div>
      {children}
    </div>
  )
}

const fieldStyle = {
  width: '100%', height: 40, padding: '0 0.75rem',
  background: 'var(--surface-2)', border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius)', color: 'var(--text-1)',
  fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.15s',
}
const labelStyle = { display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.375rem' }

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || COLORS[0])
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [pwdLoading, setPwdLoading] = useState(false)

  const profileMut = useMutation({
    mutationFn: body => api.patch('/user/me', body),
    onSuccess: res => { updateUser(res.data.data.user); toast.success('Profile updated!') },
    onError: e => toast.error(e.response?.data?.error || 'Update failed'),
  })

  const handlePassword = async e => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) { toast.error('Passwords don\'t match'); return }
    if (passwords.next.length < 6) { toast.error('Min 6 characters'); return }
    setPwdLoading(true)
    try {
      await api.patch('/user/password', { currentPassword: passwords.current, newPassword: passwords.next })
      toast.success('Password changed!')
      setPasswords({ current: '', next: '', confirm: '' })
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed')
    } finally { setPwdLoading(false) }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 600 }}>

      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, var(--brand) 0%, #A855F7 100%)',
          borderRadius: 'var(--radius-xl)', padding: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '1rem',
          boxShadow: 'var(--shadow-brand)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -30, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: avatar, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.375rem', fontWeight: 700, color: '#fff',
          flexShrink: 0, border: '3px solid rgba(255,255,255,0.3)',
          position: 'relative', zIndex: 1,
        }}>
          {getInitials(user?.name)}
        </div>
        <div style={{ position: 'relative', zIndex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</h1>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: '0.5rem', fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', padding: '0.15rem 0.6rem', borderRadius: 99, textTransform: 'capitalize', letterSpacing: '0.04em' }}>
            {user?.role || 'user'}
          </span>
        </div>
      </motion.div>

      {/* Avatar color */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section icon={Palette} title="Avatar colour">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#fff', flexShrink: 0, boxShadow: 'var(--shadow-md)' }}>
              {getInitials(user?.name)}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: '0.625rem' }}>Choose a colour for your avatar</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setAvatar(c)} style={{
                    width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                    outline: avatar === c ? `3px solid ${c}` : 'none', outlineOffset: 2,
                    transform: avatar === c ? 'scale(1.18)' : 'scale(1)',
                    transition: 'all 0.12s', boxShadow: avatar === c ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                  }} />
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => profileMut.mutate({ avatar })} disabled={profileMut.isPending}>
                {profileMut.isPending ? 'Saving…' : 'Save colour'}
              </button>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Personal info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section icon={User} title="Personal info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={fieldStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Email address</label>
              <div style={{ position: 'relative' }}>
                <input value={user?.email} disabled style={{ ...fieldStyle, opacity: 0.55, cursor: 'not-allowed', paddingLeft: '2.25rem' }} />
                <Mail size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.3rem' }}>Email address cannot be changed</p>
            </div>
            <div>
              <button className="btn btn-primary" onClick={() => { if (!name.trim()) { toast.error('Name required'); return } profileMut.mutate({ name: name.trim() }) }} disabled={profileMut.isPending}>
                {profileMut.isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Change password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section icon={Lock} title="Change password">
          <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Current password', key: 'current', placeholder: '••••••••' },
              { label: 'New password', key: 'next', placeholder: 'Min. 6 characters' },
              { label: 'Confirm new password', key: 'confirm', placeholder: 'Repeat password' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label style={labelStyle}>{label}</label>
                <input
                  type="password" placeholder={placeholder}
                  value={passwords[key]} onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  style={fieldStyle}
                  onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}
            <button type="submit" className="btn btn-secondary" disabled={pwdLoading} style={{ alignSelf: 'flex-start' }}>
              {pwdLoading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </Section>
      </motion.div>
    </div>
  )
}
