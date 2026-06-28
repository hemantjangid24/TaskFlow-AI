export default function Skeleton({ style, className }) {
  return <div className={`skeleton ${className || ''}`} style={{ height: 16, ...style }} />
}

export function BoardCardSkeleton() {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 'var(--radius)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
          <div className="skeleton" style={{ height: 11, width: '40%' }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 11, width: '85%' }} />
      <div className="skeleton" style={{ height: 11, width: '65%' }} />
      <div style={{ display: 'flex', gap: '0.375rem', marginTop: '0.25rem' }}>
        <div className="skeleton" style={{ height: 20, width: 52, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 20, width: 52, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 20, width: 52, borderRadius: 99 }} />
      </div>
    </div>
  )
}

export function TaskCardSkeleton() {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div className="skeleton" style={{ height: 13, width: '80%' }} />
      <div className="skeleton" style={{ height: 11, width: '55%' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
        <div className="skeleton" style={{ height: 18, width: 56, borderRadius: 99 }} />
        <div className="skeleton" style={{ height: 18, width: 18, borderRadius: '50%' }} />
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="metric-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ height: 11, width: 80 }} />
              <div className="skeleton" style={{ height: 28, width: 28, borderRadius: 'var(--radius-sm)' }} />
            </div>
            <div className="skeleton" style={{ height: 28, width: 56 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <div className="card" style={{ height: 220 }}><div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius-lg)' }} /></div>
        <div className="card" style={{ height: 220 }}><div className="skeleton" style={{ height: '100%', borderRadius: 'var(--radius-lg)' }} /></div>
      </div>
    </div>
  )
}
