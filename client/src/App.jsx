import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './stores/authStore.js'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'

import LandingPage        from './pages/landing/LandingPage.jsx'
import LoginPage          from './pages/auth/LoginPage.jsx'
import SignupPage         from './pages/auth/SignupPage.jsx'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx'
import ResetPasswordPage  from './pages/auth/ResetPasswordPage.jsx'
import DashboardPage      from './pages/dashboard/DashboardPage.jsx'
import BoardsPage         from './pages/boards/BoardsPage.jsx'
import KanbanPage         from './pages/kanban/KanbanPage.jsx'
import ProfilePage        from './pages/profile/ProfilePage.jsx'
import SettingsPage       from './pages/settings/SettingsPage.jsx'
import NotFoundPage       from './pages/NotFoundPage.jsx'
import AppLayout          from './components/layout/AppLayout.jsx'

const Protected = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? children : <Navigate to="/auth/login" replace />
}
const Guest = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/"                      element={<LandingPage />} />
          <Route path="/auth/login"            element={<Guest><LoginPage /></Guest>} />
          <Route path="/auth/signup"           element={<Guest><SignupPage /></Guest>} />
          <Route path="/auth/forgot-password"  element={<Guest><ForgotPasswordPage /></Guest>} />
          <Route path="/auth/reset-password"   element={<ResetPasswordPage />} />

          <Route path="/" element={<Protected><AppLayout /></Protected>}>
            <Route path="dashboard"                   element={<DashboardPage />} />
            <Route path="boards"                      element={<BoardsPage />} />
            <Route path="boards/:boardId/kanban"      element={<KanbanPage />} />
            <Route path="profile"                     element={<ProfilePage />} />
            <Route path="settings"                    element={<SettingsPage />} />
          </Route>

          {/* 404 - catches everything else */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
