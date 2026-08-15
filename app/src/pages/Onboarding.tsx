import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { toFaDigits } from '../lib/format'
import type { OnboardingData } from '../types'

const steps = ['نام ساختمان', 'تعداد واحد', 'آدرس', 'متراژ هر واحد', 'نفرات هر واحد', 'ساکنین']

export default function Onboarding() {
  const { user } = useAuth()
  const { completeOnboarding } = useApp()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    name: '',
    units: 18,
    address: '',
    areaM2: 90,
    occupants: 3,
  })
  const [error, setError] = useState('')

  if (!user) return <Navigate to="/login" replace />

  const update = (patch: Partial<OnboardingData>) => setData((d) => ({ ...d, ...patch }))

  const next = () => {
    if (step === 0 && data.name.trim().length < 3) {
      setError('نام ساختمان را بنویسید (حداقل ۳ حرف).')
      return
    }
    if (step === 3 && data.areaM2 < 20) {
      setError('متراژ هر واحد را حداقل ۲۰ متر مربع وارد کنید.')
      return
    }
    if (step === 4 && data.occupants < 1) {
      setError('تعداد نفرات هر واحد حداقل ۱ نفر است.')
      return
    }
    setError('')
    if (step === steps.length - 1) {
      completeOnboarding(data)
      navigate('/admin')
      return
    }
    setStep((s) => s + 1)
  }

  const icon = (i: number) => {
    const icons = ['bi-building', 'bi-door-open', 'bi-geo-alt', 'bi-rulers', 'bi-people-fill', 'bi-people']
    return icons[i]
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="bm-card p-4 w-100 fade-in" style={{ maxWidth: 520 }}>
        <div className="text-center mb-3">
          <span className="brand-mark mx-auto mb-2" style={{ width: 52, height: 52, fontSize: 24 }}>
            <i aria-hidden="true" className="bi bi-buildings" />
          </span>
          <h1 className="h4 mb-1">راه‌اندازی ساختمان</h1>
          <p className="text-muted-bm mb-0" style={{ fontSize: '0.85rem' }}>
            گام {toFaDigits(step + 1)} از {toFaDigits(steps.length)} — {steps[step]}
          </p>
        </div>

        <div className="d-flex justify-content-center gap-1 mb-4">
          {steps.map((_, i) => (
            <span
              key={i}
              className="rounded-circle d-grid place-content-center"
              style={{
                width: 26,
                height: 26,
                background: i <= step ? 'var(--bm-primary)' : 'var(--bm-border)',
                color: i <= step ? '#fff' : 'var(--bm-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {i === step ? <i aria-hidden="true" className={`bi ${icon(i)}`} /> : toFaDigits(i + 1)}
            </span>
          ))}
        </div>

        <Form
          onSubmit={(e) => {
            e.preventDefault()
            next()
          }}
        >
          {step === 0 && (
            <Form.Group>
              <Form.Label>نام ساختمان</Form.Label>
              <Form.Control
                size="lg"
                name="buildingName"
                autoComplete="off"
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="مثلاً: مجتمع مهرشهر، برج خیام…"
                autoFocus
              />
            </Form.Group>
          )}

          {step === 1 && (
            <Form.Group>
              <Form.Label>تعداد واحدها (۱۰ تا ۵۰)</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ width: 56 }}
                  onClick={() => update({ units: Math.max(10, data.units - 1) })}
                  aria-label="کاهش تعداد واحدها"
                >
                  <i aria-hidden="true" className="bi bi-dash-lg" />
                </Button>
                <div className="fs-2 fw-bold flex-grow-1 text-center">{toFaDigits(data.units)}</div>
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ width: 56 }}
                  onClick={() => update({ units: Math.min(50, data.units + 1) })}
                  aria-label="افزایش تعداد واحدها"
                >
                  <i aria-hidden="true" className="bi bi-plus-lg" />
                </Button>
              </div>
              <Form.Text className="text-muted-bm">برای ساختمان مستقل ۱۰ تا ۵۰ واحدی طراحی شده است.</Form.Text>
            </Form.Group>
          )}

          {step === 2 && (
            <Form.Group>
              <Form.Label>آدرس / محله (اختیاری)</Form.Label>
              <Form.Control
                size="lg"
                name="address"
                autoComplete="street-address"
                value={data.address}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="مثلاً: کرج، مهرشهر، بلوار کاج…"
              />
              <Form.Text className="text-muted-bm">برای درج روی اطلاعیه‌ها و گزارش‌ها استفاده می‌شود.</Form.Text>
            </Form.Group>
          )}

          {step === 3 && (
            <Form.Group>
              <Form.Label>متراژ هر واحد (متر مربع)</Form.Label>
              <Form.Control
                size="lg"
                inputMode="numeric"
                className="fs-4 fw-bold"
                name="areaM2"
                autoComplete="off"
                value={String(data.areaM2)}
                onChange={(e) =>
                  update({ areaM2: Number(e.target.value.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))) })
                }
              />
              <Form.Text className="text-muted-bm">
                سهم هر واحد از شارژ بر اساس متراژ محاسبه می‌شود (قانون تملک آپارتمان‌ها). می‌توانید بعداً برای هر
                واحد مقدار جداگانه تنظیم کنید.
              </Form.Text>
            </Form.Group>
          )}

          {step === 4 && (
            <Form.Group>
              <Form.Label>تعداد نفرات هر واحد</Form.Label>
              <div className="d-flex align-items-center gap-3">
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ width: 56 }}
                  onClick={() => update({ occupants: Math.max(1, data.occupants - 1) })}
                  aria-label="کاهش نفرات"
                >
                  <i aria-hidden="true" className="bi bi-dash-lg" />
                </Button>
                <div className="fs-2 fw-bold flex-grow-1 text-center">{toFaDigits(data.occupants)}</div>
                <Button
                  variant="outline-primary"
                  size="lg"
                  style={{ width: 56 }}
                  onClick={() => update({ occupants: Math.min(10, data.occupants + 1) })}
                  aria-label="افزایش نفرات"
                >
                  <i aria-hidden="true" className="bi bi-plus-lg" />
                </Button>
              </div>
              <Form.Text className="text-muted-bm">
                در صورت انتخاب «سهم بر اساس نفرات» در صدور شارژ، مبنای تقسیم نفرات خواهد بود.
              </Form.Text>
            </Form.Group>
          )}

          {step === 5 && (
            <Form.Group>
              <Form.Label>دعوت ساکنین</Form.Label>
              <div className="bm-card p-3 bg-soft-primary mb-2">
                <i aria-hidden="true" className="bi bi-magic ms-1" />
                به محض تأیید، {toFaDigits(data.units)} واحد ساخته می‌شود. لینک دعوت و شمارهٔ فعال‌سازی برای هر
                ساکن توسط خودشان پر می‌شود.
              </div>
              <Form.Text className="text-muted-bm">
                در این نسخهٔ دمو، پس از تکمیل، ساختمان فعال می‌شود و می‌توانید شارژ صادر کنید.
              </Form.Text>
            </Form.Group>
          )}

          {error && <div className="text-danger small mt-3">{error}</div>}

          <div className="d-flex justify-content-between mt-4">
            <Button variant="light" size="lg" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              قبلی
            </Button>
            <Button variant="primary" size="lg" type="submit">
              {step === steps.length - 1 ? (
                <>
                  <i aria-hidden="true" className="bi bi-check2-circle" />
                  فعال‌سازی ساختمان
                </>
              ) : (
                'ادامه'
              )}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}