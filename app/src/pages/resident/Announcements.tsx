import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function Announcements() {
  const { announcements } = useApp()

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">اطلاعیه‌ها</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          آخرین خبرهای ساختمان، مستقیم از مدیریت
        </div>
      </div>

      {announcements.length === 0 && (
        <Card className="bm-card">
          <Card.Body>
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-megaphone empty-icon" />
              <div className="fw-bold text-dark">اطلاعیه‌ای نیست</div>
              <p className="mb-0">فعلاً اطلاعیه‌ای ارسال نشده است.</p>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex flex-column gap-3">
        {announcements.map((a) => (
          <Link key={a.id} to={`/resident/announcements/${a.id}`} className="text-decoration-none">
            <Card className={`bm-card ${a.urgent ? 'border-warning' : ''}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <div className="fw-bold mb-1 d-flex gap-1">
                      {a.urgent && (
                        <span className="status-pill status-red ms-2">
                          <i aria-hidden="true" className="bi bi-exclamation-triangle-fill" />
                          فوری
                        </span>
                      )}
                      {a.title}
                    </div>
                    <div className="text-muted-bm" style={{ fontSize: '0.82rem' }}>
                      {a.sentAt}
                    </div>
                  </div>
                  <i aria-hidden="true" className="bi bi-chevron-left text-muted-bm" />
                </div>
              </Card.Body>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}