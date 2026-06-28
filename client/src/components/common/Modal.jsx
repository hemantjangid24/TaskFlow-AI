import { useEffect } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const sizes = { sm: 420, md: 520, lg: 680, xl: 860 }

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('keydown', h)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', h)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: sizes[size],
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90dvh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {title && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border)',
                flexShrink: 0,
              }}>
                <h2 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-1)', letterSpacing: '-0.015em' }}>{title}</h2>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-icon btn-sm"
                  style={{ color: 'var(--text-3)' }}
                >
                  <X size={15} />
                </button>
              </div>
            )}
            <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
