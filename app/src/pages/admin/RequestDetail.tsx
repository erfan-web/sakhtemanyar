import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { toFaDigits } from '../../lib/format'
import { RequestStatusPill } from '../../components/StatusPills'
import type { RequestStatus } from '../../types'

export default function RequestDetail() {
  const { id } = useParams()
  const { requests, updateRequest, pushToast } = useApp()
  const navigate = useNavigate()
  const req = requests.find((r) => r.id === Number(id))

  const [status, setStatus] = useState<RequestStatus | ''>(req?.status ?? '')
  const [assignee, setAssignee] = useState(req?.assignee ?? '')
  const [amount, setAmount] = useState(req?.amount ? String(req.amount) : '')
  const [result, setResult] = useState(req?.result ?? '')
  const [error, setError] = useState('')

  if (!req) {
    return (
      <Card className="bm-card">
        <Card.Body>
          <div className="empty-state">
            <i aria-hidden="true" className="bi bi-question-circle empty-icon" />
            <div className="fw-bold text-dark">درخواست پیدا نشد</div>
            <Link className="btn btn-primary" to="/admin/requests">
              بازگشت به درخواست‌ها
            </Link>
          </div>
        </Card.Body>
      </Card>
    )
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!status) {
      setError('وضعیت را انتخاب کنید.')
      return
    }
    if (status === 'done' && !(result.trim().length > 3 || (amount && Number(amount) > 0))) {
      setError('برای انجام‌شدن، مبلغ یا نتیجه را ثبت کنید.')
      return
    }
    setError('')
    const parsedAmount = amount ? Number(amount.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))) : undefined
    updateRequest(req.id, { status, assignee: assignee.trim() || undefined, amount: parsedAmount, result: result.trim() || undefined })
    pushToast(status === 'done' ? 'درخواست بسته شد؛ پیامک نتیجه برای ساکن ارسال شد' : 'وضعیت درخواست به‌روز شد')
    navigate('/admin/requests')
  }

  const statusOptions: { value: RequestStatus; label: string }[] = [
    { value: 'open', label: 'باز' },
    { value: 'in_progress', label: 'در حال انجام' },
    { value: 'done', label: 'انجام شد' },
  ]

  return (
    <div>
      <div className="mb-3">
        <Link to="/admin/requests" className="text-muted-bm small">
          <i aria-hidden="true" className="bi bi-arrow-right ms-1" />
          بازگشت به درخواست‌ها
        </Link>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="status-pill status-blue">{req.category}</span>
            <RequestStatusPill status={req.status} />
          </div>
          <h1 className="h4 mb-2">
            درخواست واحد {toFaDigits(req.unitNum)} — {req.residentName}
          </h1>
          <div className="text-muted-bm mb-3" style={{ fontSize: '0.82rem' }}>
            ثبت: {req.createdAt}
          </div>
          <p className="mb-0" style={{ lineHeight: 1.9 }}>
            {req.description}
          </p>
        </Card.Body>
      </Card>

      <Card className="bm-card">
        <Card.Body>
          <div className="fw-bold mb-3">تغییر وضعیت و جمع‌بندی</div>
          <Form onSubmit={save}>
            <Form.Group className="mb-3">
              <Form.Label>وضعیت جدید</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {statusOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={`btn ${status === o.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setStatus(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </Form.Group>

            {status === 'in_progress' && (
              <Form.Group className="mb-3 fade-in">
                <Form.Label>فرد / شرکت انجام‌دهنده</Form.Label>
                <Form.Control
                  placeholder="مثلاً: لوله‌کش صادقی…"
                  name="assignee"
                  autoComplete="off"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                />
                <Form.Text className="text-muted-bm">با تعیین فرد، به ساکن پیامک می‌شود.</Form.Text>
              </Form.Group>
            )}

            {status === 'done' && (
              <>
                <Form.Group className="mb-3 fade-in">
                  <Form.Label>مبلغ هزینه (تومان)</Form.Label>
                  <Form.Control
                    inputMode="numeric"
                    name="amount"
                    autoComplete="off"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 fade-in">
                  <Form.Label>نتیجه</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="مثلاً: اتصال برقرار و آزمایش شد…"
                    name="result"
                    autoComplete="off"
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                  />
                </Form.Group>
              </>
            )}

            {error && <div className="text-danger small mb-2">{error}</div>}
            <div className="d-flex gap-2 flex-wrap">
              <Button type="submit" variant="primary" size="lg">
                <i aria-hidden="true" className="bi bi-check2" />
                ذخیره
              </Button>
              <Button variant="light" size="lg" onClick={() => navigate('/admin/requests')}>
                انصراف
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}