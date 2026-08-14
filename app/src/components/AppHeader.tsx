import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface AppHeaderProps {
  onMenuClick?: () => void
}

export function AppHeader({ onMenuClick }: AppHeaderProps) {
  const { user, logout } = useAuth()
  const { building } = useApp()

  const roleLabel = user?.role === 'admin' ? 'مدیر ساختمان' : 'ساکن'

  return (
    <header className="app-header">
      <div className="container-fluid d-flex align-items-center justify-content-between py-2 px-3">
        <div className="d-flex align-items-center gap-2">
          {onMenuClick && (
            <button
              type="button"
              className="btn d-lg-none border-0 bg-transparent p-2"
              onClick={onMenuClick}
              aria-label="باز کردن فهرست مدیر"
            >
              <i aria-hidden="true" className="bi bi-list fs-3" />
            </button>
          )}
          <Link to="/" className="brand-mark">
            <i aria-hidden="true" className="bi bi-buildings" />
          </Link>
          <div className="lh-sm">
            <div className="fw-bold fs-6">ساختمان‌یار</div>
            <div className="text-muted-bm" style={{ fontSize: '0.72rem' }}>
              {building.name} · کرج
            </div>
          </div>
        </div>

        <Dropdown align="end">
          <Dropdown.Toggle as="button" className="btn d-flex align-items-center gap-2 border-0 bg-transparent p-1">
            <span
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: 36, height: 36, background: 'var(--bm-primary)' }}
            >
              {user?.name?.trim().charAt(0) ?? '؟'}
            </span>
            <span className="d-none d-sm-flex flex-column lh-sm text-start">
              <span className="fw-bold" style={{ fontSize: '0.85rem' }}>
                {user?.name}
              </span>
              <span className="text-muted-bm" style={{ fontSize: '0.7rem' }}>
                {roleLabel}
              </span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>{user?.name} · {user?.phone}</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => void logout()} className="d-flex gap-2 align-items-center">
              <i aria-hidden="true" className="bi bi-box-arrow-right d-flex" />
              خروج از حساب
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  )
}