import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../lib/format'

export default function NewAnnouncement() {
  const { announcements, addAnnouncement } = useApp()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [urgent, setUrgent] = useState(false)
  const [error, setError] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim().length < 3 || body.trim().length < 10) {
      setError('عنوان و متن اطلاعیه را کامل بنویسید.')
      return
    }
    setError('')
    addAnnouncement({ title: title.trim(), body: body.trim(), urgent })
    setTitle('')
    setBody('')
    setUrgent(false)
  }

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">اطلاعیه جدید</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          به همهٔ ساکنین نمایش داده می‌شود
        </div>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>عنوان</Form.Label>
              <Form.Control
                name="title"
                autoComplete="off"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: قطع برق برنامه‌ریزی‌شده…"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>متن</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="body"
                autoComplete="off"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="شرح کامل اطلاعیه…"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="urgent-switch"
                label="اطلاعیهٔ فوری (نمایش برجسته برای ساکنین)"
                checked={urgent}
                onChange={(e) => setUrgent(e.target.checked)}
              />
            </Form.Group>
            {error && <div className="text-danger small mb-2">{error}</div>}
            <Button type="submit" variant="primary" size="lg" className="w-100">
              <i aria-hidden="true" className="bi bi-send" />
              ارسال اطلاعیه
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <div className="section-eyebrow mb-2">تاریخچهٔ اطلاعیه‌ها</div>
      <div className="d-flex flex-column gap-2">
        {announcements.length === 0 && (
          <Card className="bm-card">
            <Card.Body>
              <div className="empty-state">
                <i aria-hidden="true" className="bi bi-megaphone empty-icon" />
                <div className="fw-bold text-dark">اطلاعیه‌ای ارسال نشده</div>
              </div>
            </Card.Body>
          </Card>
        )}
        {announcements.map((a) => (
          <Card key={a.id} className={`bm-card ${a.urgent ? 'border-warning' : ''}`}>
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <div className="fw-bold">
                    {a.urgent && (
                      <span className="status-pill status-red ms-2">
                        <i aria-hidden="true" className="bi bi-exclamation-triangle-fill" />
                        فوری
                      </span>
                    )}
                    {a.title}
                  </div>
                  <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                    {a.body.slice(0, 70)}
                  </div>
                </div>
                <span className="text-muted-bm small">{formatDate(a.sentAt)}</span>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}