import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/globals.css'
import { applyTheme } from './stores/uiStore.js'

// Apply saved theme BEFORE first paint — prevents flash of wrong theme
;(function () {
  const saved = localStorage.getItem('tf_theme') || 'light'
  applyTheme(saved)
})()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 2, refetchOnWindowFocus: false },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: 'var(--surface)',
            color: 'var(--text-1)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'var(--font)',
            boxShadow: 'var(--shadow-md)',
          },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>,
)
