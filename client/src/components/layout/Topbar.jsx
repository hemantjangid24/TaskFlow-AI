import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, Sun, Moon, Monitor, Bell, Search, X, Command } from 'lucide-react'
import useUIStore from '../../stores/uiStore.js'
import useAuthStore from '../../stores/authStore.js'
import { getInitials } from '../../lib/utils.js'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard',  sub: 'Overview of your work' },
  '/boards':    { title: 'Boards',     sub: 'All your projects'      },
  '/profile':   { title: 'Profile',    sub: 'Your account'           },
  '/settings':  { title: 'Settings',   sub: 'Preferences'            },
}

export default function Topbar({ onSearchOpen }) {
  const { toggleSidebar, theme, setTheme, sidebarOpen } = useUIStore()
  const { user } = useAuthStore()
  const location = useLocation()
  const isKanban = location.pathname.includes('/kanban')

  const pageInfo = Object.entries(PAGE_TITLES).find(([p]) => location.pathname.startsWith(p))?.[1]
    || { title: 'TaskFlow AI', sub: '' }

  const cycleTheme = () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')
  const ThemeIcon  = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun
  const THEME_DOT  = { dark: '#818CF8', system: '#10B981', light: '#F59E0B' }

  return (
    <header style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: '0.75rem', position: 'relative' }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flex: 1, minWidth: 0 }}>
        <button onClick={toggleSidebar} className="btn btn-ghost btn-icon" title="Toggle sidebar" style={{ flexShrink: 0 }}>
          <Menu size={18} />
        </button>
        {!isKanban && (
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.015em', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageInfo.title}</p>
            {pageInfo.sub && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: 1 }}>{pageInfo.sub}</p>}
          </div>
        )}
      </div>

      {/* Centre — search bar (desktop) */}
      <button
        onClick={onSearchOpen}
        style={{ flex: '0 1 300px', display: 'flex', alignItems: 'center', gap: '0.5rem', height: 34, padding: '0 0.75rem', background: 'var(--surface-2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', transition: 'border-color .15s', color: 'var(--text-3)' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        className="topbar-search-desktop"
      >
        <Search size={13} />
        <span style={{ fontSize: '0.8125rem', flex: 1, textAlign: 'left' }}>Search…</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flexShrink: 0 }}>
          <kbd style={{ fontSize: '0.5625rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 4px', fontFamily: 'monospace', fontWeight: 700 }}>⌘</kbd>
          <kbd style={{ fontSize: '0.5625rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 4px', fontFamily: 'monospace', fontWeight: 700 }}>K</kbd>
        </div>
      </button>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
        <button className="btn btn-ghost btn-icon topbar-search-mobile" onClick={onSearchOpen}><Search size={17}/></button>
        <button onClick={cycleTheme} className="btn btn-ghost btn-icon" title={`Theme: ${theme}`} style={{ position: 'relative' }}>
          <ThemeIcon size={17}/>
          <span style={{ position: 'absolute', bottom: 5, right: 5, width: 5, height: 5, borderRadius: '50%', background: THEME_DOT[theme], border: '1.5px solid var(--surface)' }}/>
        </button>
        <button className="btn btn-ghost btn-icon" title="Notifications" style={{ position: 'relative' }}>
          <Bell size={17}/>
          <span style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: '#EF4444', border: '1.5px solid var(--surface)' }}/>
        </button>
        <Link to="/profile" style={{ textDecoration: 'none', marginLeft: '0.25rem' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: user?.avatar || 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: '#fff', border: '2px solid var(--border)', cursor: 'pointer', transition: 'border-color .15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--brand)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            {getInitials(user?.name)}
          </div>
        </Link>
      </div>

      <style>{`
        @media(min-width:769px){.topbar-search-mobile{display:none!important}}
        @media(max-width:768px){.topbar-search-desktop{display:none!important}}
      `}</style>
    </header>
  )
}
