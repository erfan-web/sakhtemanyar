import { useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth, ADMIN_PHONE } from '../context/AuthContext'
import { DEMO_CODE, toFaDigits } from '../lib/format'
import type { Role } from '../types'

export default function Login() {
  const { user, loginAs, requestCode, verifyCode, pendingPhone } = useAuth()
  const navigate = useNavigate()

  const [phone, setPhone] = useState(pendingPhone ?? '')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>(pendingPhone ? 'code' : 'phone')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(60)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/resident'} replace />
  }

  const sendCode = () => {
    const normalized = phone.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    if (!/^09\d{9}$/.test(normalized)) {
      setError('شماره موبایل معتبر نیست؛ مثلاً ۰۹۱۲۰۰۰۰۰۰۵')
      return
    }
    setError('')
    const ok = requestCode(normalized)
    if (!ok) {
      setError('این شماره در سیستم ساختمان ثبت نشده. با دکمه‌های دمو یا شمارهٔ راهنما وارد شوید.')
      return
    }
    setPhone(normalized)
    setStep('code')
    setSeconds(60)
  }

  useEffect(() => {
    if (step !== 'code' || seconds <= 0) return
    const t = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearInterval(t)
  }, [step, seconds])

  const submitCode = () => {
    if (verifyCode(code)) {
      navigate(phone === ADMIN_PHONE ? '/admin' : '/resident')
    } else {
      setError('کد وارد شده اشتباه است. دوباره تلاش کنید.')
    }
  }

  const demo = (role: Role) => {
    loginAs(role)
    navigate(role === 'admin' ? '/admin' : '/resident')
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="bm-card p-4 w-100 fade-in" style={{ maxWidth: 420 }}>
        <div className="text-center mb-3">
          <span className="brand-mark mx-auto mb-3" style={{ width: 56, height: 56, fontSize: 26 }}>
            <i aria-hidden="true" className="bi bi-buildings" />
          </span>
          <h1 className="h4 mb-1">ساختمان‌یار کرج</h1>
          <p className="text-muted-bm mb-0" style={{ fontSize: '0.85rem' }}>
            شارژ، تعمیرات و اطلاع‌رسانی ساختمان، بدون دردسر
          </p>
        </div>

        <div className="d-grid gap-2 mb-4">
          <Button variant="outline-primary" size="lg" onClick={() => demo('admin')}>
            <i aria-hidden="true" className="bi bi-person-gear" />
            دمو: ورود به عنوان مدیر
          </Button>
          <Button variant="outline-primary" size="lg" onClick={() => demo('resident')}>
            <i aria-hidden="true" className="bi bi-person" />
            دمو: ورود به عنوان ساکن
          </Button>
        </div>

        <hr />

        {step === 'phone' ? (
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              sendCode()
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>شماره موبایل</Form.Label>
              <Form.Control
                dir="ltr"
                className="text-end"
                inputMode="tel"
                maxLength={11}
                placeholder="09xxxxxxxxx"
                name="phone"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Form.Text className="text-muted-bm">
                شماره راهنما: {toFaDigits(ADMIN_PHONE)} (مدیر) · {toFaDigits('09120000005')} (ساکن)
              </Form.Text>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" variant="primary" size="lg" className="w-100">
              دریافت کد ورود
            </Button>
          </Form>
        ) : (
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              submitCode()
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label>کد تأیید ارسال‌شده به {toFaDigits(phone)}</Form.Label>
              <Form.Control
                dir="ltr"
                className="text-center fs-4 fw-bold"
                inputMode="numeric"
                maxLength={4}
                placeholder="• • • •"
                name="code"
                autoComplete="one-time-code"
                spellCheck={false}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <Form.Text className="text-muted-bm">کد دمو: {toFaDigits(DEMO_CODE)}</Form.Text>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button type="submit" variant="primary" size="lg" className="w-100">
              ورود
            </Button>
            <div className="d-flex justify-content-between mt-3">
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                onClick={() => {
                  setStep('phone')
                  setCode('')
                  setError('')
                }}
              >
                تغییر شماره
              </Button>
              <Button
                variant="link"
                className="p-0 text-decoration-none"
                disabled={seconds > 0}
                onClick={sendCode}
              >
                {seconds > 0 ? `ارسال دوباره در ${toFaDigits(seconds)} ثانیه` : 'ارسال دوباره کد'}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  )
}