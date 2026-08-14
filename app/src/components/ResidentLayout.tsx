import { AppHeader } from './AppHeader'
import { ResidentBottomNav } from './ResidentBottomNav'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export function ResidentLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'resident') return <Navigate to="/admin" replace />

  return (
    <div className="content-with-bottomnav">
      <AppHeader />
      <main className="container-fluid px-3 py-3 fade-in" style={{ maxWidth: 1080 }}>
        <Outlet />
      </main>
      <ResidentBottomNav />
    </div>
  )
}