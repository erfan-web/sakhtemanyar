import { useState } from 'react'
import { AppHeader } from './AppHeader'
import { AdminSidebar } from './AdminSidebar'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { Offcanvas } from 'react-bootstrap'

export function AdminLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/resident" replace />

  return (
    <div className="admin-shell">
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="container-fluid px-0">
        <div className="row g-0">
          <aside className="col-lg-3 col-xl-2 d-none d-lg-block border-start admin-sidebar p-3">
            <AdminSidebar />
          </aside>
          <main className="col-lg-9 col-xl-10 px-3 px-lg-4 py-4 fade-in" style={{ maxWidth: 1240 }}>
            <Outlet />
          </main>
        </div>
      </div>

      <Offcanvas
        show={sidebarOpen}
        onHide={() => setSidebarOpen(false)}
        placement="start"
        className="admin-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fw-bold">
            <i aria-hidden="true" className="bi bi-buildings ms-2 text-primary" />
            منوی مدیر
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <AdminSidebar onNavigate={() => setSidebarOpen(false)} />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}