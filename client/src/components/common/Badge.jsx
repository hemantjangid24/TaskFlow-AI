import { cn } from '../../lib/utils.js'

export default function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
    green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400',
    red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
    yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400',
    orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  }
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border-0',
      variants[variant] || variants.default,
      className
    )}>
      {children}
    </span>
  )
}
