import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import { getStatusConfig } from '../../lib/utils.js'
import Modal from '../common/Modal.jsx'

const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const STATUSES   = ['todo', 'inprogress', 'review', 'done']
const P_COLORS   = { low: '#22C55E', medium: '#EAB308', high: '#F97316', urgent: '#EF4444' }

export default function CreateTaskModal({ open, onClose, boardId, defaultStatus = 'todo' }) {
  const qc = useQueryClient()
  const init = { title: '', description: '', priority: 'medium', status: defaultStatus, dueDate: '', effortHours: '', labels: '' }
  const [form, setForm] = useState(init)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const mut = useMutation({
    mutationFn: body => api.post(`/tasks/board/${boardId}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks', boardId] })
      qc.invalidateQueries({ queryKey: ['dashboard-stats'] })
      toast.success('Task created!')
      onClose()
      setForm(init)
    },
    onError: e => toast.error(e.response?.data?.error || 'Failed to create task'),
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    mut.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || undefined,
      effortHours: form.effortHours ? Number(form.effortHours) : undefined,
      labels: form.labels ? form.labels.split(',').map(l => l.trim()).filter(Boolean) : [],
    })
  }

  const labelStyle = { fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)', marginBottom: '0.375rem', display: 'block' }
  const inputStyle = {
    width: '100%', height: 36, padding: '0 0.75rem',
    background: 'var(--surface-2)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text-1)',
    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.15s',
  }
  const focusStyle = e => e.currentTarget.style.borderColor = 'var(--brand)'
  const blurStyle  = e => e.currentTarget.style.borderColor = 'var(--border)'

  return (
    <Modal open={open} onClose={onClose} title="Create task">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input
            autoFocus
            placeholder="What needs to be done?"
            value={form.title}
            onChange={set('title')}
            style={{ ...inputStyle, height: 40, fontSize: '0.9375rem', fontWeight: 500 }}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            placeholder="Add more context…"
            value={form.description}
            onChange={set('description')}
            rows={3}
            style={{ ...inputStyle, height: 'auto', padding: '0.625rem 0.75rem', resize: 'none' }}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Status + Priority */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select value={form.status} onChange={set('status')} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
              {STATUSES.map(s => <option key={s} value={s}>{getStatusConfig(s).label}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Priority</label>
            <select value={form.priority} onChange={set('priority')} style={{ ...inputStyle, cursor: 'pointer', color: P_COLORS[form.priority] }} onFocus={focusStyle} onBlur={blurStyle}>
              {PRIORITIES.map(p => <option key={p} value={p} style={{ color: P_COLORS[p] }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Due date + Effort */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Due date</label>
            <input type="date" value={form.dueDate} onChange={set('dueDate')} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
          <div>
            <label style={labelStyle}>Effort (hours)</label>
            <input type="number" min="0.5" step="0.5" placeholder="e.g. 4" value={form.effortHours} onChange={set('effortHours')} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
          </div>
        </div>

        {/* Labels */}
        <div>
          <label style={labelStyle}>Labels <span style={{ color: 'var(--text-3)', fontWeight: 400 }}>(comma separated)</span></label>
          <input
            placeholder="frontend, api, urgent"
            value={form.labels}
            onChange={set('labels')}
            style={inputStyle}
            onFocus={focusStyle} onBlur={blurStyle}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '0.25rem' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={mut.isPending} style={{ flex: 1 }}>
            {mut.isPending ? 'Creating…' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
