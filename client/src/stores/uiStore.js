import { create } from 'zustand'

export const applyTheme = (theme) => {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark)
  root.classList.toggle('dark', isDark)
}

// Re-apply when OS preference changes and user is on "system"
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const saved = localStorage.getItem('tf_theme') || 'light'
    if (saved === 'system') applyTheme('system')
  })
}

const useUIStore = create((set, get) => ({
  theme: localStorage.getItem('tf_theme') || 'light',
  sidebarOpen: window.innerWidth > 768,
  commandOpen: false,
  activeModal: null,

  setTheme: (theme) => {
    localStorage.setItem('tf_theme', theme)
    applyTheme(theme)
    set({ theme })
  },

  // Simple light ↔ dark toggle used by landing page button
  toggleTheme: () => {
    const current = get().theme
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('tf_theme', next)
    applyTheme(next)
    set({ theme: next })
  },

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setCommandOpen: (open) => set({ commandOpen: open }),
  openModal:  (name) => set({ activeModal: name }),
  closeModal: ()     => set({ activeModal: null }),
}))

export default useUIStore
