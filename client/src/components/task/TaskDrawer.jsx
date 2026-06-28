import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trash2, Copy, Archive, CalendarDays, Clock, Tag, Loader2, RotateCcw, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import { getPriorityConfig, getStatusConfig, formatDate, cn } from '../../lib/utils.js'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const STATUSES   = ['todo', 'inprogress', 'review', 'done']

function FieldRow({ icon: Icon, label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.625rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', minWidth: 110, paddingTop: 6 }}>
        <Icon size={13} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function DrawerSelect({ value, onChange, options, getConfig }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'transparent', border: 'none', outline: 'none',
        cursor: 'pointer', color: 'var(--text-1)',
        fontSize: '0.8125rem', fontWeight: 500,
        padding: '0.25rem 0.375rem', borderRadius: 'var(--radius-sm)',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{getConfig(opt).label}</option>
      ))}
    </select>
  )
}

export default function TaskDrawer({ task, boardId, onClose, onUpdate }) {
  const qc = useQueryClient()
  const [form, setForm] = useState(null)
  const [aiState, setAiState] = useState({ loading: false, suggestion: null, error: null })
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    if (task) {
      setForm({ ...task })
      setAiState({ loading: false, suggestion: task.aiSuggestion || null, error: null })
    }
  }, [task])

  const updateMut = useMutation({
    mutationFn: body => api.patch(`/tasks/${task._id}`, body),
    onSuccess: res => {
      qc.invalidateQueries({ queryKey: ['tasks', boardId] })
      onUpdate(res.data.data.task)
      toast.success('Saved')
    },
    onError: e => toast.error(e.response?.data?.error || 'Update failed'),
  })

  const deleteMut = useMutation({
    mutationFn: () => api.delete(`/tasks/${task._id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', boardId] }); toast.success('Deleted'); onClose() },
  })

  const dupMut = useMutation({
    mutationFn: () => api.post(`/tasks/${task._id}/duplicate`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', boardId] }); toast.success('Duplicated') },
  })

  const archiveMut = useMutation({
    mutationFn: () => api.patch(`/tasks/${task._id}/archive`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks', boardId] }); toast.success('Archived'); onClose() },
  })

  const handleSave = () => {
    updateMut.mutate({
      title: form.title, description: form.description,
      status: form.status, priority: form.priority,
      dueDate: form.dueDate, effortHours: form.effortHours ? Number(form.effortHours) : null,
      labels: form.labels,
    })
  }

  const handleAI = async () => {
    setAiState({ loading: true, suggestion: null, error: null })
    try {
      const res = await api.post('/ai/suggest', { title: form.title, description: form.description, priority: form.priority, labels: form.labels, taskId: task._id, boardId })
      setAiState({ loading: false, suggestion: res.data.data.suggestion, error: null })
    } catch (e) {
      setAiState({ loading: false, suggestion: null, error: e.response?.data?.error || 'AI failed. Check your Gemini API key.' })
    }
  }

  const applyAI = () => {
    if (!aiState.suggestion) return
    const s = aiState.suggestion
    setForm(f => ({ ...f, effortHours: s.effortHours, priority: s.priority, dueDate: s.suggestedDueDate?.split('T')[0] || f.dueDate }))
    updateMut.mutate({ effortHours: s.effortHours, priority: s.priority, dueDate: s.suggestedDueDate, aiSuggestion: { ...s, generatedAt: new Date() } })
    toast.success('AI suggestion applied!')
  }

  const addLabel = e => {
    if (e.key === 'Enter' && newLabel.trim()) {
      if (!form.labels?.includes(newLabel.trim())) setForm(f => ({ ...f, labels: [...(f.labels || []), newLabel.trim()] }))
      setNewLabel('')
    }
  }

  if (!task || !form) return null
  const statusCfg = getStatusConfig(form.status)
  const priorCfg  = getPriorityConfig(form.priority)

  return (
    <AnimatePresence>
      {task && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(2px)', zIndex: 50 }}
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 32 }}
            style={{
              position: 'fixed', right: 0, top: 0, height: '100dvh',
              width: '100%', maxWidth: 460,
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 51, display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge status-${form.status}`}>{statusCfg.label}</span>
                <span className={`badge priority-${form.priority}`}>{priorCfg.label}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[
                  { icon: Copy,    title: 'Duplicate', fn: () => dupMut.mutate(),                                          loading: dupMut.isPending     },
                  { icon: Archive, title: 'Archive',   fn: () => archiveMut.mutate(),                                     loading: archiveMut.isPending  },
                  { icon: Trash2,  title: 'Delete',    fn: () => window.confirm('Delete this task?') && deleteMut.mutate(), loading: deleteMut.isPending, danger: true },
                ].map(({ icon: Icon, title, fn, loading, danger }) => (
                  <button key={title} onClick={fn} disabled={loading} title={title} className="btn btn-ghost btn-icon btn-sm"
                    style={{ color: danger ? '#EF4444' : 'var(--text-3)' }}
                    onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.08)' : 'var(--surface-2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {loading ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Icon size={13} />}
                  </button>
                ))}
                <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--text-3)', marginLeft: 4 }}>
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>

              {/* Title */}
              <textarea
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-1)',
                  resize: 'none', lineHeight: 1.4, fontFamily: 'inherit',
                  letterSpacing: '-0.02em', marginBottom: '0.375rem',
                }}
                rows={2}
                placeholder="Task title…"
              />

              {/* Description */}
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add a description…"
                rows={3}
                style={{
                  width: '100%', background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius)', padding: '0.625rem 0.75rem',
                  fontSize: '0.8125rem', color: 'var(--text-1)', resize: 'none',
                  fontFamily: 'inherit', lineHeight: 1.55, outline: 'none',
                  transition: 'border-color 0.15s',
                  marginBottom: '1rem',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--brand)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />

              {/* Fields */}
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <FieldRow icon={CheckCircle2} label="Status">
                  <DrawerSelect value={form.status} onChange={v => setForm(f => ({ ...f, status: v }))} options={STATUSES} getConfig={getStatusConfig} />
                </FieldRow>
                <FieldRow icon={Sparkles} label="Priority">
                  <DrawerSelect value={form.priority} onChange={v => setForm(f => ({ ...f, priority: v }))} options={PRIORITIES} getConfig={getPriorityConfig} />
                </FieldRow>
                <FieldRow icon={CalendarDays} label="Due date">
                  <input
                    type="date"
                    value={form.dueDate ? form.dueDate.split('T')[0] : ''}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    style={{
                      background: 'transparent', border: 'none', outline: 'none',
                      color: 'var(--text-1)', fontSize: '0.8125rem', fontWeight: 500,
                      fontFamily: 'inherit', cursor: 'pointer', padding: '0.25rem 0.375rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  />
                </FieldRow>
                <FieldRow icon={Clock} label="Effort">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <input
                      type="number" min="0.5" max="100" step="0.5"
                      value={form.effortHours || ''}
                      onChange={e => setForm(f => ({ ...f, effortHours: e.target.value }))}
                      placeholder="0"
                      style={{
                        width: 60, background: 'transparent', border: 'none', outline: 'none',
                        color: 'var(--text-1)', fontSize: '0.8125rem', fontWeight: 500,
                        fontFamily: 'inherit', padding: '0.25rem 0.375rem', borderRadius: 'var(--radius-sm)',
                      }}
                      onFocus={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onBlur={e => e.currentTarget.style.background = 'transparent'}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>hours</span>
                  </div>
                </FieldRow>
                <FieldRow icon={Tag} label="Labels">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {form.labels?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {form.labels.map(l => (
                          <span key={l} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                            background: 'var(--brand-light)', color: 'var(--brand)',
                            fontSize: '0.6875rem', fontWeight: 600,
                            padding: '0.2rem 0.5rem', borderRadius: 99,
                          }}>
                            {l}
                            <button onClick={() => setForm(f => ({ ...f, labels: f.labels.filter(x => x !== l) }))}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', lineHeight: 1, padding: 0, fontSize: '0.875rem' }}>
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <input
                      value={newLabel}
                      onChange={e => setNewLabel(e.target.value)}
                      onKeyDown={addLabel}
                      placeholder="Type and press Enter"
                      style={{
                        background: 'transparent', border: 'none', outline: 'none',
                        fontSize: '0.8125rem', color: 'var(--text-1)', fontFamily: 'inherit',
                        padding: '0.25rem 0.375rem', borderRadius: 'var(--radius-sm)',
                        width: '100%',
                      }}
                      onFocus={e => e.currentTarget.style.background = 'var(--surface-2)'}
                      onBlur={e => e.currentTarget.style.background = 'transparent'}
                    />
                  </div>
                </FieldRow>
              </div>

              {/* AI Assistant */}
              <div style={{
                marginTop: '1rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}>
                {/* AI header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: 'linear-gradient(135deg, rgba(91,80,248,0.06) 0%, rgba(168,85,247,0.06) 100%)',
                  borderBottom: aiState.suggestion || aiState.loading || aiState.error ? '1px solid var(--border)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 'var(--radius-sm)',
                      background: 'linear-gradient(135deg, var(--brand), #A855F7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Sparkles size={13} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-1)' }}>AI Assistant</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>Powered by Gemini</div>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={handleAI}
                    disabled={aiState.loading}
                    style={{
                      background: aiState.loading ? 'var(--surface-2)' : 'var(--brand)',
                      color: aiState.loading ? 'var(--text-3)' : '#fff',
                      border: 'none',
                      gap: '0.375rem',
                    }}
                  >
                    {aiState.loading
                      ? <><Loader2 size={12} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing…</>
                      : aiState.error
                      ? <><RotateCcw size={12} /> Retry</>
                      : <><Sparkles size={12} /> Suggest estimate</>
                    }
                  </button>
                </div>

                {/* AI loading */}
                {aiState.loading && (
                  <div style={{ padding: '1.25rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.375rem', marginBottom: '0.5rem' }}>
                      {[0, 1, 2].map(i => (
                        <div key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)',
                          animation: 'pulse-dot 1.2s ease-in-out infinite',
                          animationDelay: `${i * 0.2}s`,
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>Gemini is reading your task…</p>
                  </div>
                )}

                {/* AI error */}
                {aiState.error && !aiState.loading && (
                  <div style={{ padding: '0.875rem 1rem', background: 'rgba(239,68,68,0.06)' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#EF4444' }}>{aiState.error}</p>
                  </div>
                )}

                {/* AI result */}
                {aiState.suggestion && !aiState.loading && !aiState.error && (
                  <div style={{ padding: '0.875rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                      {[
                        { label: 'Effort', value: `${aiState.suggestion.effortHours}h` },
                        { label: 'Due',    value: aiState.suggestion.suggestedDueDate ? formatDate(aiState.suggestion.suggestedDueDate) : '—' },
                        { label: 'Priority', value: aiState.suggestion.priority, capitalize: true },
                      ].map(({ label, value, capitalize }) => (
                        <div key={label} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '0.625rem 0.75rem', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.25rem' }}>{label}</div>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-1)', textTransform: capitalize ? 'capitalize' : 'none' }}>{value}</div>
                        </div>
                      ))}
                    </div>
                    {aiState.suggestion.reasoning && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', lineHeight: 1.55, fontStyle: 'italic', padding: '0.5rem 0.75rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--brand)' }}>
                        {aiState.suggestion.reasoning}
                      </p>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={applyAI}
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <CheckCircle2 size={14} /> Apply suggestion
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '0.875rem 1rem',
              borderTop: '1px solid var(--border)',
              display: 'flex', gap: '0.625rem', justifyContent: 'flex-end',
              flexShrink: 0, background: 'var(--surface)',
            }}>
              <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={updateMut.isPending}>
                {updateMut.isPending ? <><Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> Saving…</> : 'Save changes'}
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
