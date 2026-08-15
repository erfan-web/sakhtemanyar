import { useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { formatToman, toFaDigits } from '../../lib/format'
import { ChargeStatusPill } from '../../components/StatusPills'
import type { Utility } from '../../types'

const UTILITY_LABELS: Record<Utility, string> = { water: 'آب', electricity: 'برق', gas: 'گاز' }

export default function MyCharge() {
  const { user } = useAuth()
  const { units, building, payCharge } = useApp()
  const unit = units.find((u) => u.id === user?.unitId)

  const [trackingCode, setTrackingCode] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  if (!unit) return null

  const sharedUtilities = (Object.keys(building.utilityConfig) as Utility[]).filter(
    (u) => building.utilityConfig[u] === 'shared',
  )
  const separateUtilities = (Object.keys(building.utilityConfig) as Utility[]).filter(
    (u) => building.utilityConfig[u] === 'separate',
  )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingCode.trim().length < 4) {
      setError('شماره پیگیری رسید معتبر نیست.')
      return
    }
    setError('')
    payCharge(unit.id, { trackingCode: trackingCode.trim(), note: note.trim() || undefined })
    setTrackingCode('')
    setNote('')
  }

  const needPayment = unit.chargeStatus === 'issued' || unit.chargeStatus === 'debt'

  return (
    <div>
      <div className="mb-3">
        <div className="section-eyebrow">{building.name}</div>
        <h1 className="page-title mb-0">شارژ من</h1>
      </div>

      <Card className="bm-card mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                شارژ {building.month} — واحد {toFaDigits(unit.num)}
              </div>
              <div className="fs-2 fw-bold mt-1">{formatToman(unit.chargeAmount ?? 0)}</div>
              <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                {toFaDigits(unit.areaM2)} متر مربع · {toFaDigits(unit.occupants)} نفر
              </div>
            </div>
            <ChargeStatusPill status={unit.chargeStatus} />
          </div>
        </Card.Body>
      </Card>

      <Card className="bm-card mb-3">
        <Card.Header className="bg-transparent fw-bold">اجزای شارژ این ماه</Card.Header>
        <Card.Body className="p-0">
          <div className="d-flex justify-content-between px-3 py-2 border-top">
            <span className="text-muted-bm">سهم بر اساس {building.divisionMethod === 'area' ? 'متراژ' : building.divisionMethod === 'persons' ? 'نفرات' : 'تساوی'}</span>
            <span>{formatToman(unit.chargeAmount ?? 0)}</span>
          </div>
          <div className="d-flex justify-content-between px-3 py-2 border-top">
            <span className="text-muted-bm">قبوض مشترک ({sharedUtilities.map((u) => UTILITY_LABELS[u]).join('، ') || '—'})</span>
            <span className="text-muted-bm">در همین سهم لحاظ شده</span>
          </div>
          <div className="d-flex justify-content-between px-3 py-2 border-top">
            <span className="text-muted-bm">قبوض مستقل ({separateUtilities.map((u) => UTILITY_LABELS[u]).join('، ') || '—'})</span>
            <span className="text-muted-bm">مستقیماً به اداره می‌پردازید</span>
          </div>
          <div className="d-flex justify-content-between px-3 py-2 border-top">
            <span className="text-muted-bm">مهلت پرداخت</span>
            <span className="text-muted-bm">پایان {building.month}</span>
          </div>
        </Card.Body>
      </Card>

      {unit.chargeStatus === 'paid' && (
        <Card className="bm-card border-0 status-green mb-3">
          <Card.Body className="d-flex align-items-center gap-3">
            <i aria-hidden="true" className="bi bi-check-circle-fill fs-3" />
            <div>
              <div className="fw-bold">شارژ این ماه پرداخت شده است.</div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                ممنون! همه‌چیز مرتب است.
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {unit.chargeStatus === 'awaiting' && unit.receipt && (
        <Card className="bm-card border-0 status-amber mb-3">
          <Card.Body className="d-flex align-items-start gap-3">
            <i aria-hidden="true" className="bi bi-hourglass-split fs-3" />
            <div>
              <div className="fw-bold">رسید ثبت شد؛ در انتظار تأیید مدیر</div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                شماره پیگیری: {unit.receipt.trackingCode}
                {unit.receipt.note ? ` · ${unit.receipt.note}` : ''}
                <br />
                اگر رسید را اشتباه ثبت کرده‌اید، دوباره با همان شماره ثبت کنید؛ موارد تکراری ادغام می‌شوند.
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {needPayment && (
        <>
          <Card className="bm-card mb-3">
            <Card.Body>
              <div className="fw-bold mb-2">
                <i aria-hidden="true" className="bi bi-credit-card ms-2 text-primary" />
                کارت‌به‌کارت — شماره کارت ساختمان
              </div>
              <div dir="ltr" className="text-center fs-5 fw-bold bg-soft-primary rounded-3 py-3 my-2">
                {toFaDigits('6104-3372-1260-9012')}
              </div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                مبلغ دقیق <strong>{formatToman(unit.chargeAmount ?? 0)}</strong> را واریز کنید؛ سپس شما شماره پیگیری را این‌جا ثبت کنید تا مدیر آن را تأیید کند.
              </div>
            </Card.Body>
          </Card>

          <Card className="bm-card mb-3">
            <Card.Body>
              <div className="fw-bold mb-3">ثبت رسید پرداخت</div>
              <Form onSubmit={submit}>
                <Form.Group className="mb-3">
                  <Form.Label>شماره پیگیری (۱۶ رقمی)</Form.Label>
                  <Form.Control
                    dir="ltr"
                    inputMode="numeric"
                    placeholder="مثلاً 1899752563…"
                    name="trackingCode"
                    autoComplete="off"
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>یادداشت (اختیاری)</Form.Label>
                  <Form.Control
                    placeholder="مثلاً: از کارت ملت، ساعت ۱۰ صبح…"
                    name="note"
                    autoComplete="off"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </Form.Group>
                {error && <div className="text-danger small mb-2">{error}</div>}
                <Button type="submit" variant="primary" size="lg" className="w-100">
                  ثبت رسید و اعلام به مدیر
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </>
      )}

      {unit.chargeStatus === 'debt' && (
        <Card className="bm-card border-0 status-red mb-3">
          <Card.Body className="d-flex align-items-start gap-3">
            <i aria-hidden="true" className="bi bi-exclamation-triangle-fill fs-3" />
            <div>
              <div className="fw-bold">پرونده بدهکاری شما باز است</div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                شارژ ماه‌های قبل هم تسویه نشده است؛ لطفاً برای شفاف‌سازی با مدیر در تماس باشید.
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}