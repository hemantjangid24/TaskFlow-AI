import { cn } from '../../lib/utils.js'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Icon size={22} className="text-slate-400 dark:text-slate-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-500 max-w-xs mb-5">{description}</p>
      )}
      {action}
    </div>
  )
}
