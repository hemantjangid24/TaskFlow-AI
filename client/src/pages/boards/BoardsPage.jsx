import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, MoreHorizontal, Trash2, Pencil, Kanban, LayoutGrid, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import { BOARD_COLORS, BOARD_EMOJIS, timeAgo } from '../../lib/utils.js'
import { BoardCardSkeleton } from '../../components/common/Skeleton.jsx'
import Modal from '../../components/common/Modal.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'

function BoardForm({ initial, onSubmit, loading }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [color, setColor] = useState(initial?.color || BOARD_COLORS[0])
  const [emoji, setEmoji] = useState(initial?.emoji || '📋')

  return (
    <form onSubmit={e => { e.preventDefault(); if (!title.trim()) { toast.error('Title required'); return } onSubmit({ title: title.trim(), description: description.trim(), color, emoji }) }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      {/* Preview */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.875rem 1rem',
        background: 'var(--surface-2)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius)', background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
          {emoji}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title || 'Board name'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{description || 'Description'}</div>
        </div>
      </div>

      <Input label="Board name *" placeholder="e.g. Sprint 12, Marketing, Bug Fixes" value={title} onChange={e => setTitle(e.target.value)} />
      <Input label="Description" placeholder="What is this board for?" value={description} onChange={e => setDescription(e.target.value)} />

      {/* Emoji */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)' }}>Icon</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {BOARD_EMOJIS.map(em => (
            <button key={em} type="button" onClick={() => setEmoji(em)} style={{
              width: 36, height: 36, borderRadius: 'var(--radius-sm)',
              fontSize: '1.0625rem', cursor: 'pointer',
              border: emoji === em ? '2px solid var(--brand)' : '1.5px solid var(--border)',
              background: emoji === em ? 'var(--brand-light)' : 'var(--surface)',
              transition: 'all 0.12s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-2)' }}>Color</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {BOARD_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: c, cursor: 'pointer', border: 'none',
              outline: color === c ? `3px solid ${c}` : 'none',
              outlineOffset: 2,
              transform: color === c ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.12s',
              boxShadow: color === c ? `0 0 0 2px var(--surface)` : 'none',
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.625rem', paddingTop: '0.25rem' }}>
        <Button type="submit" loading={loading} style={{ flex: 1 }}>
          {initial ? 'Save changes' : 'Create board'}
        </Button>
      </div>
    </form>
  )
}

function BoardMenu({ board, onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={e => { e.preventDefault(); e.stopPropagation(); setOpen(!open) }}
        className="btn btn-ghost btn-icon btn-sm"
        style={{ color: 'var(--text-3)', opacity: 0 }}
        ref={el => el && (el.closest('.board-card')?.addEventListener('mouseenter', () => el.style.opacity = '1'), el.closest('.board-card')?.addEventListener('mouseleave', () => { if (!open) el.style.opacity = '0' }))}
      >
        <MoreHorizontal size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 5 }} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              style={{
                position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 10,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                minWidth: 140, overflow: 'hidden', padding: '0.25rem',
              }}
            >
              {[
                { icon: Pencil, label: 'Edit', color: 'var(--text-1)', fn: () => { setOpen(false); onEdit(board) } },
                { icon: Trash2, label: 'Delete', color: '#EF4444', fn: () => { setOpen(false); onDelete(board) } },
              ].map(({ icon: Icon, label, color, fn }) => (
                <button key={label} onClick={fn} style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.5rem 0.625rem',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)', color, fontSize: '0.8125rem', fontWeight: 500,
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Icon size={13} /> {label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function BoardCard({ board, onEdit, onDelete }) {
  const done = board.taskStats?.done || 0
  const total = board.totalTasks || 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card card-hover board-card"
      style={{ padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius)',
            background: board.color + '18',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.0625rem', flexShrink: 0,
            border: `1px solid ${board.color}25`,
          }}>
            {board.emoji || '📋'}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              {board.title}
            </h3>
            <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
              {board.description || 'No description'}
            </p>
          </div>
        </div>
        <BoardMenu board={board} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Task status chips */}
      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
        {[
          { key: 'todo',       label: 'Todo',    bg: 'var(--surface-2)', color: 'var(--text-3)' },
          { key: 'inprogress', label: 'Active',  bg: '#EFF6FF',          color: '#1D4ED8'       },
          { key: 'done',       label: 'Done',    bg: '#F0FDF4',          color: '#15803D'       },
        ].map(({ key, label, bg, color }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: bg, borderRadius: 99, padding: '0.2rem 0.6rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color }}>{board.taskStats?.[key] || 0}</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontWeight: 500 }}>Progress</span>
            <span style={{ fontSize: '0.6875rem', color: 'var(--text-2)', fontWeight: 600 }}>{pct}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--surface-2)', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ height: '100%', background: pct === 100 ? '#10B981' : 'var(--brand)', borderRadius: 99 }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.125rem' }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>{timeAgo(board.createdAt)}</span>
        <Link
          to={`/boards/${board._id}/kanban`}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.375rem' }}
        >
          <Kanban size={12} /> Open
        </Link>
      </div>
    </motion.div>
  )
}

export default function BoardsPage() {
  const qc = useQueryClient()
  const [search, setSearch] = useState('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editBoard, setEditBoard] = useState(null)
  const [deleteBoard, setDeleteBoard] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['boards'],
    queryFn: () => api.get('/boards').then(r => r.data.data),
  })

  const createMut = useMutation({
    mutationFn: b => api.post('/boards', b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['boards'] }); qc.invalidateQueries({ queryKey: ['dashboard-stats'] }); setCreateOpen(false); toast.success('Board created!') },
    onError: e => toast.error(e.response?.data?.error || 'Failed'),
  })
  const editMut = useMutation({
    mutationFn: ({ id, ...b }) => api.patch(`/boards/${id}`, b),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['boards'] }); setEditBoard(null); toast.success('Board updated!') },
    onError: e => toast.error(e.response?.data?.error || 'Failed'),
  })
  const deleteMut = useMutation({
    mutationFn: id => api.delete(`/boards/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['boards'] }); qc.invalidateQueries({ queryKey: ['dashboard-stats'] }); setDeleteBoard(null); toast.success('Board deleted.') },
    onError: e => toast.error(e.response?.data?.error || 'Failed'),
  })

  const filtered = (data?.boards || []).filter(b => b.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }} className="animate-fade-up">
        <div>
          <h1 className="t-h1" style={{ color: 'var(--text-1)' }}>My Boards</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {data?.boards?.length || 0} board{data?.boards?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setCreateOpen(true)}>New board</Button>
      </div>

      {/* Search */}
      <div className="animate-fade-up delay-1" style={{ maxWidth: 360 }}>
        <Input
          prefix={<Search size={14} />}
          placeholder="Search boards…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {[...Array(6)].map((_, i) => <BoardCardSkeleton key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          <AnimatePresence>
            {filtered.map(board => (
              <BoardCard key={board._id} board={board} onEdit={setEditBoard} onDelete={setDeleteBoard} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <LayoutGrid size={22} style={{ color: 'var(--text-3)' }} />
          </div>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', marginBottom: '0.375rem' }}>
            {search ? 'No boards found' : 'No boards yet'}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)', marginBottom: '1.25rem' }}>
            {search ? `No results for "${search}"` : 'Create your first board to start organising tasks'}
          </p>
          {!search && <Button icon={Plus} onClick={() => setCreateOpen(true)}>Create first board</Button>}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create a new board">
        <BoardForm onSubmit={createMut.mutate} loading={createMut.isPending} />
      </Modal>

      <Modal open={!!editBoard} onClose={() => setEditBoard(null)} title="Edit board">
        {editBoard && <BoardForm initial={editBoard} onSubmit={b => editMut.mutate({ id: editBoard._id, ...b })} loading={editMut.isPending} />}
      </Modal>

      <Modal open={!!deleteBoard} onClose={() => setDeleteBoard(null)} title="Delete board" size="sm">
        {deleteBoard && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-2)', lineHeight: 1.6 }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-1)' }}>"{deleteBoard.title}"</strong>? All tasks inside will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.625rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setDeleteBoard(null)}>Cancel</Button>
              <Button variant="danger" loading={deleteMut.isPending} onClick={() => deleteMut.mutate(deleteBoard._id)}>Delete board</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
