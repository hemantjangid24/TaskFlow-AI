import { cn } from '../../lib/utils.js'

const Spinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      style={{ animation: 'spin 0.8s linear infinite', transformOrigin: 'center' }}
    />
  </svg>
)

export default function Button({
  children, variant = 'primary', size = '',
  className, loading, disabled, icon: Icon, type = 'button', onClick, ...props
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-primary'

  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn('btn', variantClass, sizeClass, 'w-full' in (props || {}) && 'w-full', className)}
      {...props}
    >
      {loading ? <Spinner /> : Icon && <Icon size={size === 'sm' ? 13 : 15} />}
      {children}
    </button>
  )
}
