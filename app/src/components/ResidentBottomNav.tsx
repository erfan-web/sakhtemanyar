import { NavLink } from 'react-router-dom'

const items = [
  { to: '/resident', end: true, icon: 'bi-house-door', label: 'خانه' },
  { to: '/resident/charge', icon: 'bi-wallet2', label: 'شارژ من' },
  { to: '/resident/requests', icon: 'bi-tools', label: 'درخواست‌ها' },
  { to: '/resident/announcements', icon: 'bi-megaphone', label: 'اطلاعیه‌ها' },
]

export function ResidentBottomNav() {
  return (
    <nav className="bottom-nav" aria-label="ناوبری اصلی ساکن">
      <div className="d-flex">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => `bn-item flex-fill ${isActive ? 'active' : ''}`}
          >
            <i aria-hidden="true" className={`bi ${it.icon} fs-5`} />
            <span>{it.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}