import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { RequestStatusPill } from '../../components/StatusPills'
import { REQUEST_CATEGORIES } from '../../data/mockData'
import { formatToman } from '../../lib/format'

export default function MyRequests() {
  const { user } = useAuth()
  const { requests, addRequest } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState(REQUEST_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const myRequests = requests.filter((r) => r.unitId === user?.unitId)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.unitId) return
    if (description.trim().length < 10) {
      setError('شرح درخواست را کامل‌تر بنویسید (حداقل ۱۰ حرف).')
      return
    }
    setError('')
    addRequest({ unitId: user.unitId, category, description: description.trim() })
    setDescription('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="page-title mb-0">درخواست‌های من</h1>
          <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
            ثبت خرابی و پیگیری وضعیت
          </div>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowForm((v) => !v)}>
          <i aria-hidden="true" className="bi bi-plus-lg" />
          درخواست جدید
        </Button>
      </div>

      {showForm && (
        <Card className="bm-card mb-3 fade-in">
          <Card.Body>
            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>نوع مشکل</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} name="category">
                  {REQUEST_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>شرح مشکل</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="مثلاً: شیر آشپزخانه چکه می‌کند و آب حمام فشار ندارد…"
                  name="description"
                  autoComplete="off"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Form.Text className="text-muted-bm">
                  عکس گرفتن لازم نیست؛ توضیح دقیق برای پیگیری سریع‌تر کافی است. پس از ثبت، به مدیر پیامک می‌رسد.
                </Form.Text>
              </Form.Group>
              {error && <div className="text-danger small mb-2">{error}</div>}
              <Button type="submit" variant="primary" className="w-100" size="lg">
                ثبت درخواست
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {myRequests.length === 0 && !showForm && (
        <Card className="bm-card">
          <Card.Body>
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-tools empty-icon" />
              <div className="fw-bold text-dark">هنوز درخواستی ثبت نکرده‌اید</div>
              <p className="mb-0">با دکمهٔ «درخواست جدید»، مشکل ساختمان را ثبت کنید تا از وضعیتش با خبر باشید.</p>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex flex-column gap-3">
        {myRequests.map((r) => (
          <Card key={r.id} className="bm-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                <div>
                  <span className="status-pill status-blue ms-2">{r.category}</span>
                  <span className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                    {r.createdAt}
                  </span>
                </div>
                <RequestStatusPill status={r.status} />
              </div>
              <p className="mb-2" style={{ fontSize: '0.92rem' }}>
                {r.description}
              </p>
              {r.status === 'in_progress' && r.assignee && (
                <div className="text-muted-bm" style={{ fontSize: '0.82rem' }}>
                  <i aria-hidden="true" className="bi bi-person-gear ms-1" />
                  در دست اقدام توسط: {r.assignee}
                </div>
              )}
              {r.status === 'done' && (
                <div className="bm-card p-3 mt-2" style={{ background: 'var(--bm-green-soft)' }}>
                  <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                    نتیجه: {r.result}
                  </div>
                  {r.amount ? (
                    <div className="text-muted-bm" style={{ fontSize: '0.82rem' }}>
                      هزینه ثبت‌شده: {formatToman(r.amount)}
                    </div>
                  ) : null}
                </div>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}