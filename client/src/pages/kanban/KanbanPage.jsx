import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ArrowLeft, Sparkles, SlidersHorizontal, X, ChevronDown, Calendar, Clock, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api.js'
import { getPriorityConfig, formatDate, isOverdue, cn } from '../../lib/utils.js'
import { TaskCardSkeleton } from '../../components/common/Skeleton.jsx'
import TaskDrawer from '../../components/task/TaskDrawer.jsx'
import CreateTaskModal from '../../components/task/CreateTaskModal.jsx'

const COLUMNS = [
  { id: 'todo',       label: 'Todo',       dot: '#8B91A8', bg: 'rgba(139,145,168,.10)' },
  { id: 'inprogress', label: 'In Progress', dot: '#3B82F6', bg: 'rgba(59,130,246,.08)'  },
  { id: 'review',     label: 'In Review',   dot: '#8B5CF6', bg: 'rgba(139,92,246,.08)'  },
  { id: 'done',       label: 'Done',        dot: '#10B981', bg: 'rgba(16,185,129,.08)'  },
]

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 }

/* ── Filter Bar ── */
function FilterBar({ filters, setFilters, taskCount, filteredCount }) {
  const [open, setOpen] = useState(false)
  const hasFilters = filters.priority !== 'all' || filters.sort !== 'default' || filters.overdue

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
      {/* Filter button */}
      <button
        onClick={() => setOpen(!open)}
        className={`btn btn-sm ${hasFilters ? 'btn-primary' : 'btn-secondary'}`}
        style={{ gap: '0.375rem', position: 'relative' }}
      >
        <SlidersHorizontal size={13} />
        Filters
        {hasFilters && (
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', position: 'absolute', top: 5, right: 5 }} />
        )}
      </button>

      {/* Active filter chips */}
      <AnimatePresence>
        {filters.priority !== 'all' && (
          <motion.div key="p" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--brand-light)', color: 'var(--brand)', border: '1px solid rgba(91,80,248,.2)', borderRadius: 99, padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600 }}>
            Priority: {filters.priority}
            <button onClick={() => setFilters(f => ({ ...f, priority: 'all' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand)', padding: 0, display: 'flex' }}>
              <X size={11} />
            </button>
          </motion.div>
        )}
        {filters.overdue && (
          <motion.div key="o" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', borderRadius: 99, padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600 }}>
            Overdue only
            <button onClick={() => setFilters(f => ({ ...f, overdue: false }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B91C1C', padding: 0, display: 'flex' }}>
              <X size={11} />
            </button>
          </motion.div>
        )}
        {filters.sort !== 'default' && (
          <motion.div key="s" initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#F0FDF4', color: '#15803D', border: '1px solid #86EFAC', borderRadius: 99, padding: '0.2rem 0.625rem', fontSize: '0.75rem', fontWeight: 600 }}>
            Sort: {filters.sort === 'due_asc' ? 'Due ↑' : filters.sort === 'due_desc' ? 'Due ↓' : filters.sort === 'priority' ? 'Priority' : filters.sort}
            <button onClick={() => setFilters(f => ({ ...f, sort: 'default' }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803D', padding: 0, display: 'flex' }}>
              <X size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task count */}
      {hasFilters && (
        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)', fontWeight: 500 }}>
          {filteredCount}/{taskCount} tasks
        </span>
      )}

      {/* Clear all */}
      {hasFilters && (
        <button onClick={() => setFilters({ priority: 'all', sort: 'default', overdue: false })}
          className="btn btn-ghost btn-sm" style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>
          Clear all
        </button>
      )}

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: .95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: .95, y: -6 }}
              style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 21, marginTop: '0.375rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                padding: '1rem', minWidth: 240, display: 'flex', flexDirection: 'column', gap: '1rem',
              }}
            >
              {/* Priority filter */}
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
                  Filter by priority
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                  {['all', 'urgent', 'high', 'medium', 'low'].map(p => (
                    <button key={p} onClick={() => setFilters(f => ({ ...f, priority: p }))}
                      style={{
                        padding: '0.25rem 0.625rem', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600,
                        border: '1.5px solid', cursor: 'pointer', transition: 'all .12s',
                        background: filters.priority === p ? 'var(--brand)' : 'var(--surface-2)',
                        color: filters.priority === p ? '#fff' : 'var(--text-2)',
                        borderColor: filters.priority === p ? 'var(--brand)' : 'var(--border)',
                      }}>
                      {p === 'all' ? 'All' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: '0.5rem' }}>
                  Sort by
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {[
                    { v: 'default',  l: 'Default (drag order)' },
                    { v: 'priority', l: 'Priority (urgent first)' },
                    { v: 'due_asc',  l: 'Due date (earliest first)' },
                    { v: 'due_desc', l: 'Due date (latest first)' },
                  ].map(({ v, l }) => (
                    <button key={v} onClick={() => setFilters(f => ({ ...f, sort: v }))}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)',
                        background: filters.sort === v ? 'var(--brand-light)' : 'transparent',
                        color: filters.sort === v ? 'var(--brand)' : 'var(--text-2)',
                        border: 'none', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: filters.sort === v ? 600 : 400,
                        transition: 'all .12s', textAlign: 'left', width: '100%',
                      }}
                      onMouseEnter={e => { if (filters.sort !== v) e.currentTarget.style.background = 'var(--surface-2)' }}
                      onMouseLeave={e => { if (filters.sort !== v) e.currentTarget.style.background = 'transparent' }}
                    >
                      {filters.sort === v && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)', flexShrink: 0 }} />}
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overdue toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-1)' }}>Overdue tasks only</span>
                <button
                  onClick={() => setFilters(f => ({ ...f, overdue: !f.overdue }))}
                  style={{
                    width: 36, height: 20, borderRadius: 99, border: 'none', cursor: 'pointer',
                    background: filters.overdue ? '#EF4444' : 'var(--border-2)',
                    transition: 'background .2s', position: 'relative', flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 2, left: filters.overdue ? 18 : 2,
                    width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'left .2s',
                  }} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Task Card ── */
function TaskCard({ task, index, onClick }) {
  const p      = getPriorityConfig(task.priority)
  const overdue = isOverdue(task.dueDate)

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(task)}
          className={`task-card${snapshot.isDragging ? ' dragging' : ''}`}
          style={{ ...provided.draggableProps.style, marginBottom: '0.5rem' }}
        >
          {task.labels?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.5rem' }}>
              {task.labels.slice(0, 3).map(l => (
                <span key={l} style={{ fontSize: '0.625rem', fontWeight: 600, background: 'var(--brand-light)', color: 'var(--brand)', padding: '0.15rem 0.45rem', borderRadius: 99 }}>
                  {l}
                </span>
              ))}
            </div>
          )}
          <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-1)', lineHeight: 1.45, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {task.title}
          </p>
          {task.description && (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {task.description}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.375rem', flexWrap: 'wrap' }}>
            <span className={`badge priority-${task.priority}`}>{p.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {task.effortHours && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.6875rem', color: 'var(--text-3)' }}>
                  <Clock size={10} />{task.effortHours}h
                </span>
              )}
              {task.dueDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.6875rem', fontWeight: overdue ? 600 : 400, color: overdue ? '#EF4444' : 'var(--text-3)' }}>
                  <Calendar size={10} />{formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  )
}

/* ── Column ── */
function Column({ col, tasks, onAdd, onTaskClick, isLoading }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 272, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem', padding: '0 0.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dot, flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{col.label}</span>
          <span style={{ fontSize: '0.6875rem', fontWeight: 700, background: 'var(--surface-2)', color: 'var(--text-3)', padding: '0.1rem 0.45rem', borderRadius: 99 }}>{tasks.length}</span>
        </div>
        <button onClick={() => onAdd(col.id)} className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--text-3)' }} title={`Add task to ${col.label}`}>
          <Plus size={14} />
        </button>
      </div>

      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`kanban-col${snapshot.isDraggingOver ? ' drag-over' : ''}`}
            style={{ flex: 1, minHeight: 120, background: snapshot.isDraggingOver ? 'rgba(91,80,248,.06)' : col.bg }}
          >
            {isLoading
              ? [...Array(2)].map((_, i) => <TaskCardSkeleton key={i} />)
              : tasks.map((task, idx) => (
                  <TaskCard key={task._id} task={task} index={idx} onClick={onTaskClick} />
                ))
            }
            {provided.placeholder}
            {!isLoading && tasks.length === 0 && (
              <button onClick={() => onAdd(col.id)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 72, border: '1.5px dashed var(--border-2)', borderRadius: 'var(--radius)', background: 'transparent', cursor: 'pointer', color: 'var(--text-3)', fontSize: '0.8125rem', fontWeight: 500, transition: 'all .15s', gap: '0.375rem' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.color = 'var(--brand)'; e.currentTarget.style.background = 'var(--brand-light)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text-3)'; e.currentTarget.style.background = 'transparent' }}>
                <Plus size={14} /> Add task
              </button>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}

/* ── Page ── */
export default function KanbanPage() {
  const { boardId }  = useParams()
  const qc           = useQueryClient()
  const [selectedTask, setSelectedTask] = useState(null)
  const [createStatus, setCreateStatus] = useState(null)
  const [filters, setFilters] = useState({ priority: 'all', sort: 'default', overdue: false })

  const { data: boardData } = useQuery({
    queryKey: ['board', boardId],
    queryFn:  () => api.get(`/boards/${boardId}`).then(r => r.data.data),
  })
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks', boardId],
    queryFn:  () => api.get(`/tasks/board/${boardId}`).then(r => r.data.data),
  })

  const moveMut = useMutation({
    mutationFn: ({ id, status, order }) => api.patch(`/tasks/${id}/move`, { status, order }),
    onError: () => { qc.invalidateQueries({ queryKey: ['tasks', boardId] }); toast.error('Failed to move task') },
  })

  const allTasks = tasksData?.tasks || []

  // Apply filters + sort
  const processedTasks = useMemo(() => {
    let tasks = [...allTasks]
    if (filters.priority !== 'all')  tasks = tasks.filter(t => t.priority === filters.priority)
    if (filters.overdue)             tasks = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done')
    if (filters.sort === 'priority') tasks.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 2) - (PRIORITY_ORDER[b.priority] ?? 2))
    else if (filters.sort === 'due_asc')  tasks.sort((a, b) => (a.dueDate ? new Date(a.dueDate) : Infinity) - (b.dueDate ? new Date(b.dueDate) : Infinity))
    else if (filters.sort === 'due_desc') tasks.sort((a, b) => (b.dueDate ? new Date(b.dueDate) : -Infinity) - (a.dueDate ? new Date(a.dueDate) : -Infinity))
    else tasks.sort((a, b) => a.order - b.order)
    return tasks
  }, [allTasks, filters])

  const getCol = (id) => processedTasks.filter(t => t.status === id)

  const onDragEnd = ({ destination, source, draggableId }) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return
    qc.setQueryData(['tasks', boardId], old => old && {
      ...old, tasks: old.tasks.map(t => t._id === draggableId
        ? { ...t, status: destination.droppableId, order: destination.index }
        : t),
    })
    moveMut.mutate({ id: draggableId, status: destination.droppableId, order: destination.index })
  }

  const board = boardData?.board
  const hasFilters = filters.priority !== 'all' || filters.sort !== 'default' || filters.overdue

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 56px)', margin: '-1.5rem', overflow: 'hidden' }}>

      {/* Kanban header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <Link to="/boards" className="btn btn-ghost btn-icon btn-sm" style={{ color: 'var(--text-2)', flexShrink: 0 }}>
            <ArrowLeft size={16} />
          </Link>
          {board && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: board.color + '18', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                {board.emoji || '📋'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{board.title}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>
                  {hasFilters ? `${processedTasks.length} of ${allTasks.length}` : allTasks.length} task{allTasks.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setCreateStatus('todo')} style={{ gap: '0.375rem' }}>
            <Sparkles size={13} style={{ color: 'var(--brand)' }} /> AI suggest
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setCreateStatus('todo')}>
            <Plus size={14} /> Add task
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ padding: '0.625rem 1.25rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', flexShrink: 0, position: 'relative' }}>
        <FilterBar filters={filters} setFilters={setFilters} taskCount={allTasks.length} filteredCount={processedTasks.length} />
      </div>

      {/* Board */}
      <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '1.25rem' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '1rem', height: '100%', alignItems: 'flex-start' }}>
            {COLUMNS.map(col => (
              <Column key={col.id} col={col} tasks={getCol(col.id)} onAdd={setCreateStatus} onTaskClick={setSelectedTask} isLoading={isLoading} />
            ))}
          </div>
        </DragDropContext>
      </div>

      <TaskDrawer task={selectedTask} boardId={boardId} onClose={() => setSelectedTask(null)} onUpdate={setSelectedTask} />
      <CreateTaskModal open={!!createStatus} defaultStatus={createStatus} boardId={boardId} onClose={() => setCreateStatus(null)} />
    </div>
  )
}
