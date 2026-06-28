import { Component } from 'react'
import { RefreshCw, Home } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100dvh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg)', padding: '2rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 420 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💥</div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-1)', marginBottom: '0.625rem', letterSpacing: '-0.02em' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-3)', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            An unexpected error occurred. Try refreshing the page — if this keeps happening, please contact support.
          </p>
          {this.state.error && (
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.375rem' }}>Error detail</p>
              <p style={{ fontSize: '0.75rem', color: '#EF4444', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                {this.state.error.message}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
              style={{ gap: '0.4rem' }}
            >
              <RefreshCw size={14} /> Refresh page
            </button>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/' }}
              className="btn btn-secondary"
              style={{ gap: '0.4rem' }}
            >
              <Home size={14} /> Go home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
