import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { ToastHost } from './components/ToastHost'
import { ResidentLayout } from './components/ResidentLayout'
import { AdminLayout } from './components/AdminLayout'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import ResidentHome from './pages/resident/ResidentHome'
import MyCharge from './pages/resident/MyCharge'
import MyRequests from './pages/resident/MyRequests'
import Announcements from './pages/resident/Announcements'
import AnnouncementDetail from './pages/resident/AnnouncementDetail'
import AdminHome from './pages/admin/AdminHome'
import IssueCharge from './pages/admin/IssueCharge'
import Units from './pages/admin/Units'
import Expenses from './pages/admin/Expenses'
import AdminRequests from './pages/admin/AdminRequests'
import RequestDetail from './pages/admin/RequestDetail'
import NewAnnouncement from './pages/admin/NewAnnouncement'
import BuildingAdmin from './pages/admin/BuildingAdmin'
import Utilities from './pages/admin/Utilities'

function HomeRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={user.role === 'admin' ? '/admin' : '/resident'} replace />
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/resident" element={<ResidentLayout />}>
          <Route index element={<ResidentHome />} />
          <Route path="charge" element={<MyCharge />} />
          <Route path="requests" element={<MyRequests />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="announcements/:id" element={<AnnouncementDetail />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="issue" element={<IssueCharge />} />
          <Route path="units" element={<Units />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="requests/:id" element={<RequestDetail />} />
          <Route path="announce" element={<NewAnnouncement />} />
          <Route path="utilities" element={<Utilities />} />
          <Route path="building" element={<BuildingAdmin />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </>
  )
}