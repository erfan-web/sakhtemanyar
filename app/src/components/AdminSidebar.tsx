import { NavLink } from 'react-router-dom'

const items = [
  { to: '/admin', end: true, icon: 'bi-grid-1x2', label: 'خانه' },
  { to: '/admin/issue', icon: 'bi-cash-stack', label: 'صدور شارژ' },
  { to: '/admin/utilities', icon: 'bi-plugin', label: 'قبوض و کنتور' },
  { to: '/admin/units', icon: 'bi-people', label: 'وضعیت واحدها' },
  { to: '/admin/expenses', icon: 'bi-receipt', label: 'هزینه‌ها' },
  { to: '/admin/requests', icon: 'bi-tools', label: 'درخواست‌ها' },
  { to: '/admin/announce', icon: 'bi-megaphone', label: 'اطلاعیه' },
  { to: '/admin/building', icon: 'bi-buildings', label: 'ساختمان' },
]

interface AdminSidebarProps {
  onNavigate?: () => void
}

export function AdminSidebar({ onNavigate }: AdminSidebarProps) {
  return (
    <nav className="d-flex flex-column gap-1" aria-label="ناوبری مدیر">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.end}
          onClick={onNavigate}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i aria-hidden="true" className={`bi ${it.icon} fs-6`} />
          <span>{it.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}