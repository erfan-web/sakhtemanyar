import { useMemo, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatToman, toFaDigits } from '../../lib/format'
import { computeShares, methodLabel, totalWeight } from '../../lib/charge'
import type { DivisionMethod, Utility } from '../../types'

const METHODS: { value: DivisionMethod; label: string }[] = [
  { value: 'area', label: 'متراژ' },
  { value: 'persons', label: 'نفرات' },
  { value: 'equal', label: 'تساوی' },
]

export default function IssueCharge() {
  const { building, units, expenses, issueMonthlyCharge, setDivisionMethod } = useApp()
  const navigate = useNavigate()

  const [budget, setBudget] = useState('')
  const [error, setError] = useState('')

  const sharedUtilities = useMemo(
    () => (Object.keys(building.utilityConfig) as Utility[]).filter((u) => building.utilityConfig[u] === 'shared'),
    [building.utilityConfig],
  )

  const parsedBudget = Number(budget.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))))
  const totalSharedExpense = useMemo(
    () =>
      expenses
        .filter((e) => sharedUtilities.some((u) => e.category.includes(u === 'water' ? 'آب' : u === 'electricity' ? 'برق' : 'گاز')))
        .reduce((s, e) => s + e.amount, 0),
    [expenses, sharedUtilities],
  )

  const amount = Number.isFinite(parsedBudget) && parsedBudget > 0 ? parsedBudget : totalSharedExpense
  const preview = useMemo(
    () => (amount > 0 ? computeShares(units, amount, building.divisionMethod) : []),
    [units, amount, building.divisionMethod],
  )
  const tw = useMemo(() => totalWeight(units, building.divisionMethod), [units, building.divisionMethod])
  const totalExpected = useMemo(() => preview.reduce((s, i) => s + i.amount, 0), [preview])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || amount < 100_000) {
      setError('مبلغ بودجهٔ ماهانه را وارد کنید (حداقل ۱۰۰ هزار تومان).')
      return
    }
    setError('')
    issueMonthlyCharge(amount)
    navigate('/admin/units')
  }

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">صدور شارژ ماهانه</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          {building.month} · {toFaDigits(units.length)} واحد · {methodLabel(building.divisionMethod)}
        </div>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body>
          <Form onSubmit={submit}>
            <Form.Group className="mb-3">
              <Form.Label>روش تقسیم شارژ</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {METHODS.map((m) => (
                  <Button
                    key={m.value}
                    variant={building.divisionMethod === m.value ? 'primary' : 'outline-secondary'}
                    onClick={() => setDivisionMethod(m.value)}
                  >
                    {m.label}
                  </Button>
                ))}
              </div>
              <Form.Text className="text-muted-bm">{methodLabel(building.divisionMethod)}</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>جمع هزینه‌های مشترک ماه (تومان)</Form.Label>
              <Form.Control
                inputMode="numeric"
                size="lg"
                className="fs-4 fw-bold"
                name="budget"
                autoComplete="off"
                placeholder={totalSharedExpense > 0 ? toFaDigits(totalSharedExpense) : 'مثلاً 15000000'}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              {totalSharedExpense > 0 && (
                <Form.Text className="text-muted-bm">
                  مجموع قبوض مشترک ثبت‌شده در هزینه‌ها: {formatToman(totalSharedExpense)} — اگر عددی ننویسید همین
                  استفاده می‌شود.
                </Form.Text>
              )}
            </Form.Group>

            <div className="bm-card p-3 mb-3 bg-soft-primary">
              <div className="d-flex justify-content-between">
                <span className="text-muted-bm">جمع کل مورد انتظار</span>
                <strong>{formatToman(totalExpected)}</strong>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted-bm">واحدها</span>
                <span>{toFaDigits(units.length)} واحد</span>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <span className="text-muted-bm">سهم مبنای تقسیم</span>
                <span>
                  {building.divisionMethod === 'area'
                    ? `${toFaDigits(tw)} متر مربع`
                    : building.divisionMethod === 'persons'
                      ? `${toFaDigits(tw)} نفر`
                      : `${toFaDigits(units.length)} واحد`}
                </span>
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

      {preview.length > 0 && (
        <Card className="bm-card">
          <Card.Header className="bg-transparent fw-bold">پیش‌نمایش سهم هر واحد</Card.Header>
          <Card.Body className="p-0">
            <div className="d-none d-md-flex border-bottom fw-bold px-3 py-2 small text-muted-bm">
              <div className="col-3">واحد</div>
              <div className="col-3">متراژ</div>
              <div className="col-3">نفرات</div>
              <div className="col-3">شارژ</div>
            </div>
            {preview.map((item) => {
              const u = units.find((x) => x.id === item.unitId)
              if (!u) return null
              return (
                <div key={item.unitId} className="d-flex border-bottom px-3 py-2">
                  <div className="col-3">واحد {toFaDigits(u.num)}</div>
                  <div className="col-3 text-muted-bm">{toFaDigits(u.areaM2)} متر</div>
                  <div className="col-3 text-muted-bm">{toFaDigits(u.occupants)} نفر</div>
                  <div className="col-3 fw-bold">{formatToman(item.amount)}</div>
                </div>
              )
            })}
          </Card.Body>
        </Card>
      )}

      <Card className="bm-card mt-3">
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
