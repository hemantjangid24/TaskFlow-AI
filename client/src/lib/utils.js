import { formatDistanceToNow, isPast, isToday, isTomorrow, format } from 'date-fns'

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const formatDate = (date) => {
  if (!date) return null
  const d = new Date(date)
  if (isToday(d)) return 'Today'
  if (isTomorrow(d)) return 'Tomorrow'
  return format(d, 'MMM d, yyyy')
}

export const timeAgo = (date) => {
  if (!date) return ''
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const isOverdue = (date) => {
  if (!date) return false
  const d = new Date(date)
  return isPast(d) && !isToday(d)
}

export const getPriorityConfig = (priority) => ({
  urgent: { label: 'Urgent', color: '#EF4444', bg: '#FEF2F2' },
  high:   { label: 'High',   color: '#F97316', bg: '#FFF7ED' },
  medium: { label: 'Medium', color: '#EAB308', bg: '#FEFCE8' },
  low:    { label: 'Low',    color: '#22C55E', bg: '#F0FDF4' },
}[priority] || { label: 'Medium', color: '#EAB308', bg: '#FEFCE8' })

export const getStatusConfig = (status) => ({
  todo:       { label: 'Todo'        },
  inprogress: { label: 'In Progress' },
  review:     { label: 'In Review'   },
  done:       { label: 'Done'        },
}[status] || { label: 'Todo' })

export const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'

export const BOARD_COLORS = [
  '#5B50F8','#8B5CF6','#EC4899','#EF4444',
  '#F97316','#EAB308','#10B981','#06B6D4',
]
export const BOARD_EMOJIS = ['📋','🚀','💡','🎯','🔥','⚡','🌟','🛠️','📊','🎨','🏆','🔬']
