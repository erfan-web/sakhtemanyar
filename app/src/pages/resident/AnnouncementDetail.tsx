import { Card } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function AnnouncementDetail() {
  const { id } = useParams()
  const { announcements } = useApp()
  const a = announcements.find((x) => x.id === Number(id))

  if (!a) {
    return (
      <Card className="bm-card">
        <Card.Body>
          <div className="empty-state">
            <i aria-hidden="true" className="bi bi-question-circle empty-icon" />
            <div className="fw-bold text-dark">اطلاعیه پیدا نشد</div>
            <Link className="btn btn-primary" to="/resident/announcements">
              بازگشت به فهرست اطلاعیه‌ها
            </Link>
          </div>
        </Card.Body>
      </Card>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <Link to="/resident/announcements" className="text-muted-bm small">
          <i aria-hidden="true" className="bi bi-arrow-right ms-1" />
          بازگشت به اطلاعیه‌ها
        </Link>
      </div>
      <Card className="bm-card">
        <Card.Body>
          <div className="d-flex align-items-center gap-2 mb-2">
            {a.urgent && (
              <span className="status-pill status-red">
                <i aria-hidden="true" className="bi bi-exclamation-triangle-fill" />
                فوری
              </span>
            )}
            <span className="text-muted-bm" style={{ fontSize: '0.82rem' }}>
              {a.sentAt}
            </span>
          </div>
          <h1 className="h4 mb-3">{a.title}</h1>
          <p style={{ lineHeight: 1.9 }}>{a.body}</p>
        </Card.Body>
      </Card>
    </div>
  )
}