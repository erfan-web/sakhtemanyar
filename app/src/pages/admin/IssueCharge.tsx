import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatToman, toFaDigits } from '../../lib/format'

export default function IssueCharge() {
  const { building, units, issueMonthlyCharge } = useApp()
  const navigate = useNavigate()
  const [amount, setAmount] = useState(String(building.defaultCharge))
  const [error, setError] = useState('')

  const parsed = Number(amount.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))))
  const total = parsed * units.length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parsed || parsed < 100_000) {
      setError('مبلغ شارژ را به تومان وارد کنید (حداقل ۱۰۰ هزار تومان).')
      return
    }
    setError('')
    issueMonthlyCharge(parsed)
    navigate('/admin/units')
  }

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">صدور شارژ ماهانه</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          {building.month} · {toFaDigits(units.length)} واحد
        </div>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>مبلغ شارژ هر واحد (تومان)</Form.Label>
              <Form.Control
                inputMode="numeric"
                size="lg"
                className="fs-4 fw-bold"
                name="amount"
                autoComplete="off"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Form.Text className="text-muted-bm">
                شارژ پیش‌فرض فعلی: {formatToman(building.defaultCharge)} — مقدار را می‌توانید ویرایش کنید.
              </Form.Text>
            </Form.Group>

            <div className="bm-card p-3 mb-3 bg-soft-primary">
              <div className="d-flex justify-content-between">
                <span className="text-muted-bm">جمع کل مورد انتظار</span>
                <strong>{formatToman(total)}</strong>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted-bm">واحدها</span>
                <span>{toFaDigits(units.length)} واحد</span>
              </div>
            </div>

            {error && <div className="text-danger small mb-2">{error}</div>}

            <Button type="submit" variant="primary" size="lg" className="w-100">
              <i aria-hidden="true" className="bi bi-send" />
              صدور شارژ و ارسال پیامک
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="bm-card">
        <Card.Body className="py-2">
          <div className="text-muted-bm" style={{ fontSize: '0.82rem' }}>
            <i aria-hidden="true" className="bi bi-info-circle ms-1" />
            با صدور شارژ، کارت وضعیت همهٔ واحدها بازنشانی می‌شود و به ساکنین پیامک اطلاع‌رسانی ارسال می‌شود
            (در این نسخهٔ دمو شبیه‌سازی می‌شود).
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}