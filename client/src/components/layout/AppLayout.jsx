import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar  from './Topbar.jsx'
import GlobalSearch from '../common/GlobalSearch.jsx'
import useUIStore from '../../stores/uiStore.js'

export default function AppLayout() {
  const { sidebarOpen } = useUIStore()
  const [searchOpen, setSearchOpen] = useState(false)

  // Cmd+K / Ctrl+K opens global search
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  return (
    <div style={{ display: 'flex', height: '100dvh', background: 'var(--bg)', overflow: 'hidden' }}>
      <Sidebar />

      <div
        style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', minWidth: 0,
          marginLeft: sidebarOpen ? 'var(--sidebar)' : 0,
          transition: 'margin-left 0.28s cubic-bezier(.4,0,.2,1)',
        }}
        className="main-panel"
      >
        <style>{`@media(max-width:768px){.main-panel{margin-left:0!important}}`}</style>

        <Topbar onSearchOpen={() => setSearchOpen(true)} />

        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ padding: '1.5rem', maxWidth: 1280, margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
