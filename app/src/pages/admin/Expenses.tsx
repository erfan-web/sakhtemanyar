import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { EXPENSE_CATEGORIES } from '../../data/mockData'
import { formatShortToman, formatToman, toFaDigits } from '../../lib/format'

export default function Expenses() {
  const { expenses, addExpense } = useApp()
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  const total = expenses.reduce((s, e) => s + e.amount, 0)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(amount.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))))
    if (!parsed || parsed <= 0) {
      setError('مبلغ هزینه را به تومان وارد کنید.')
      return
    }
    setError('')
    addExpense({ category, amount: parsed, note: note.trim() })
    setAmount('')
    setNote('')
    setShowForm(false)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h1 className="page-title mb-0">هزینه‌های ساختمان</h1>
          <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
            ثبت و صورت‌وضعیت هزینه‌ها — شفاف برای همهٔ واحدها
          </div>
        </div>
        <Button variant="primary" onClick={() => setShowForm((v) => !v)}>
          <i aria-hidden="true" className="bi bi-plus-lg" />
          ثبت هزینه
        </Button>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div>
            <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
              جمع هزینه‌های این ماه ({toFaDigits(expenses.length)} مورد)
            </div>
            <div className="fs-2 fw-bold">{formatShortToman(total)}</div>
          </div>
          <i aria-hidden="true" className="bi bi-receipt fs-1 text-muted-bm" />
        </Card.Body>
      </Card>

      {showForm && (
        <Card className="bm-card mb-3 fade-in">
          <Card.Body>
            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>دسته هزینه</Form.Label>
                <Form.Select value={category} onChange={(e) => setCategory(e.target.value)} name="category">
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>مبلغ (تومان)</Form.Label>
                <Form.Control
                  inputMode="numeric"
                  name="amount"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="مثلاً ۱٬۲۰۰٬۰۰۰…"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>توضیح (اختیاری)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="note"
                  autoComplete="off"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="مثلاً: قبض برق مشترک مرداد…"
                />
              </Form.Group>
              {error && <div className="text-danger small mb-2">{error}</div>}
              <Button type="submit" variant="primary" className="w-100" size="lg">
                ثبت هزینه
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {expenses.length === 0 && !showForm && (
        <Card className="bm-card">
          <Card.Body>
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-receipt empty-icon" />
              <div className="fw-bold text-dark">هزینه‌ای ثبت نشده</div>
              <p className="mb-0">اولین هزینه را با دکمهٔ «ثبت هزینه» اضافه کنید.</p>
            </div>
          </Card.Body>
        </Card>
      )}

      <div className="d-flex flex-column gap-2">
        {expenses.map((e) => (
          <Card key={e.id} className="bm-card">
            <Card.Body className="py-3">
              <div className="d-flex justify-content-between align-items-center gap-2">
                <div className="list-row">
                  <span className="list-icon bg-soft-primary text-primary">
                    <i aria-hidden="true" className="bi bi-receipt" />
                  </span>
                  <div>
                    <div className="fw-bold">{e.category}</div>
                    <div className="text-muted-bm" style={{ fontSize: '0.78rem' }}>
                      {e.note} · {e.at}
                    </div>
                  </div>
                </div>
                <div className="fw-bold">{formatToman(e.amount)}</div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  )
}