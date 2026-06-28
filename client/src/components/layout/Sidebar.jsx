import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Kanban, User, Settings, LogOut, Zap, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore.js'
import useUIStore from '../../stores/uiStore.js'
import { getInitials } from '../../lib/utils.js'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/boards',    icon: Kanban,          label: 'Boards'    },
  { to: '/profile',   icon: User,            label: 'Profile'   },
  { to: '/settings',  icon: Settings,        label: 'Settings'  },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const isMobile = () => window.innerWidth <= 768

  const handleLogout = () => { logout(); navigate('/auth/login') }
  const handleNavClick = () => { if (isMobile()) toggleSidebar() }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
            style={{
              position: 'fixed', top: 0, left: 0, height: '100dvh',
              width: 'var(--sidebar)',
              background: 'var(--surface)',
              borderRight: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column',
              zIndex: 40,
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Logo */}
            <div style={{ padding: '1rem 1.125rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{
                  width: 32, height: 32,
                  background: 'linear-gradient(135deg, var(--brand) 0%, #A855F7 100%)',
                  borderRadius: 'var(--radius)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-brand)',
                  flexShrink: 0,
                }}>
                  <Zap size={15} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>TaskFlow</div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 600, color: 'var(--brand)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '-1px' }}>AI Powered</div>
                </div>
              </div>
              {/* Mobile close */}
              <button className="btn btn-ghost btn-icon btn-sm hide-desktop" onClick={toggleSidebar}>
                <X size={15} />
              </button>
            </div>

            {/* Nav label */}
            <div style={{ padding: '1.25rem 1.125rem 0.5rem' }}>
              <span className="t-label" style={{ color: 'var(--text-3)' }}>Menu</span>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '0.25rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.125rem', overflowY: 'auto' }}>
              {NAV.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={handleNavClick}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} strokeWidth={isActive => isActive ? 2.5 : 2} />
                  {label}
                </NavLink>
              ))}
            </nav>

            {/* User */}
            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.625rem 0.75rem',
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: user?.avatar || 'var(--brand)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6875rem', fontWeight: 700, color: '#fff',
                  flexShrink: 0,
                }}>
                  {getInitials(user?.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.name}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user?.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-icon btn-sm"
                  title="Sign out"
                  style={{ color: 'var(--text-3)', flexShrink: 0 }}
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
