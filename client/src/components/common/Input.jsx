import { cn } from '../../lib/utils.js'
import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, hint, className, prefix, suffix, ...props }, ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label style={{ color: 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 500 }}>{label}</label>}
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>{prefix}</span>
      )}
      <input
        ref={ref}
        className={cn('input-base', prefix && 'pl-9', suffix && 'pr-9', error && 'border-red-400 focus:border-red-400', className)}
        style={{ borderColor: error ? '#EF4444' : undefined }}
        {...props}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>{suffix}</span>
      )}
    </div>
    {error && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{error}</p>}
    {hint && !error && <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{hint}</p>}
  </div>
))
Input.displayName = 'Input'
export default Input

export const Textarea = forwardRef(({ label, error, hint, className, rows = 3, ...props }, ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label style={{ color: 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 500 }}>{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={cn('input-base', className)}
      style={{ height: 'auto', padding: '0.625rem 0.75rem', resize: 'none', borderColor: error ? '#EF4444' : undefined }}
      {...props}
    />
    {error && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{error}</p>}
    {hint && !error && <p style={{ color: 'var(--text-3)', fontSize: '0.75rem' }}>{hint}</p>}
  </div>
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef(({ label, error, children, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label style={{ color: 'var(--text-2)', fontSize: '0.8125rem', fontWeight: 500 }}>{label}</label>}
    <select
      ref={ref}
      className={cn('input-base', className)}
      style={{ cursor: 'pointer', borderColor: error ? '#EF4444' : undefined }}
      {...props}
    >
      {children}
    </select>
    {error && <p style={{ color: '#EF4444', fontSize: '0.75rem' }}>{error}</p>}
  </div>
))
Select.displayName = 'Select'
