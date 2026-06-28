import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Kanban, CheckSquare, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api.js'
import { formatDate, getPriorityConfig } from '../../lib/utils.js'
import useUIStore from '../../stores/uiStore.js'

function useDebounce(val, ms) {
  const [deb, setDeb] = useState(val)
  useEffect(() => { const t = setTimeout(() => setDeb(val), ms); return () => clearTimeout(t) }, [val, ms])
  return deb
}

export default function GlobalSearch({ open, onClose }) {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 300)
  const inputRef  = useRef(null)
  const navigate  = useNavigate()

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 80) }
  }, [open])

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [open, onClose])

  const { data: results, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn:  async () => {
      if (!debounced.trim() || debounced.length < 2) return { boards: [], tasks: [] }
      const [boards, tasks] = await Promise.all([
        api.get(`/boards?search=${encodeURIComponent(debounced)}`).then(r => r.data.data.boards || []),
        api.get(`/tasks/search?q=${encodeURIComponent(debounced)}`).then(r => r.data.data.tasks || []).catch(() => []),
      ])
      return { boards: boards.slice(0, 4), tasks: tasks.slice(0, 6) }
    },
    enabled: debounced.length >= 2,
    staleTime: 0,
  })

  const total = (results?.boards?.length || 0) + (results?.tasks?.length || 0)
  const hasResults = debounced.length >= 2 && !isFetching && total === 0

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 'clamp(60px,10vh,120px) 1rem 1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: .96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .96, y: -12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            style={{ position: 'relative', width: '100%', maxWidth: 560, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderBottom: debounced.length >= 2 ? '1px solid var(--border)' : 'none' }}>
              <Search size={17} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search boards and tasks…"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '1rem', color: 'var(--text-1)', fontFamily: 'var(--font)' }}
              />
              {isFetching && <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--brand)', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />}
              {query && (
                <button onClick={() => setQuery('')} className="btn btn-ghost btn-icon btn-sm" style={{ flexShrink: 0 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Results */}
            {debounced.length >= 2 && !isFetching && (
              <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                {hasResults ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: '0.875rem' }}>
                    No results for "<strong>{debounced}</strong>"
                  </div>
                ) : (
                  <>
                    {results?.boards?.length > 0 && (
                      <div>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '0.625rem 1rem 0.375rem' }}>Boards</p>
                        {results.boards.map(board => (
                          <Link key={board._id} to={`/boards/${board._id}/kanban`} onClick={onClose}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', textDecoration: 'none', transition: 'background .1s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: board.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9375rem', flexShrink: 0 }}>
                              {board.emoji || '📋'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.title}</p>
                              {board.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.description}</p>}
                            </div>
                            <Kanban size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                          </Link>
                        ))}
                      </div>
                    )}
                    {results?.tasks?.length > 0 && (
                      <div style={{ borderTop: results?.boards?.length ? '1px solid var(--border)' : 'none' }}>
                        <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-3)', padding: '0.625rem 1rem 0.375rem' }}>Tasks</p>
                        {results.tasks.map(task => {
                          const p = getPriorityConfig(task.priority)
                          return (
                            <button key={task._id} onClick={onClose}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background .1s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <CheckSquare size={14} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 2 }}>
                                  <span className={`badge priority-${task.priority}`} style={{ fontSize: '0.625rem' }}>{p.label}</span>
                                  {task.dueDate && <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={10}/>{formatDate(task.dueDate)}</span>}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Empty / prompt */}
            {debounced.length < 2 && (
              <div style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Quick navigation</p>
                {[
                  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
                  { to: '/boards',    label: 'All boards', icon: '📋' },
                  { to: '/profile',   label: 'Profile',    icon: '👤' },
                  { to: '/settings',  label: 'Settings',   icon: '⚙️' },
                ].map(({ to, label, icon }) => (
                  <Link key={to} to={to} onClick={onClose}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius)', textDecoration: 'none', transition: 'background .1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span>{icon}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)' }}>{label}</span>
                    <ArrowRight size={12} style={{ color: 'var(--text-3)', marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            )}

            {/* Footer hint */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '0.5rem 1rem', display: 'flex', gap: '1rem' }}>
              {[['↵', 'select'], ['↑↓', 'navigate'], ['Esc', 'close']].map(([key, action]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <kbd style={{ fontSize: '0.625rem', fontFamily: 'monospace', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 4, padding: '1px 5px', color: 'var(--text-3)', fontWeight: 600 }}>{key}</kbd>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
