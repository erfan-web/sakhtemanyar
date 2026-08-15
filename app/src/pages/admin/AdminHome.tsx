import { Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatShortToman, toFaDigits } from '../../lib/format'
import { RequestStatusPill } from '../../components/StatusPills'
import { useAuth } from '../../context/AuthContext'

export default function AdminHome() {
  const { units, expenses, requests, building, resetDemo } = useApp()
  const { user } = useAuth()
  const navigate = useNavigate()

  const paidUnits = units.filter((u) => u.chargeStatus === 'paid')
  const collected = paidUnits.reduce((sum, u) => sum + (u.chargeAmount ?? 0), 0)
  const debtors = units.filter((u) => u.chargeStatus === 'debt').length
  const openRequests = requests.filter((r) => r.status !== 'done')
  const monthExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const awaitingCount = units.filter((u) => u.chargeStatus === 'awaiting').length

  const stats = [
    { icon: 'bi-cash-coin', label: 'جمع‌آوری‌شده', value: formatShortToman(collected), hint: `${toFaDigits(paidUnits.length)} واحد از ${toFaDigits(units.length)}`, tone: 'text-primary' },
    { icon: 'bi-hourglass-split', label: 'در انتظار تأیید', value: toFaDigits(awaitingCount), hint: 'رسید ثبت‌شده', tone: 'text-warning' },
    { icon: 'bi-exclamation-octagon', label: 'بدهکاران', value: toFaDigits(debtors), hint: 'نیاز به پیگیری', tone: 'text-danger' },
    { icon: 'bi-receipt', label: 'هزینهٔ ماه', value: formatShortToman(monthExpenses), hint: building.month, tone: 'text-secondary' },
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <div className="section-eyebrow">{building.name} · {building.address}</div>
          <h1 className="page-title mb-0">خانه، {user?.name?.split(' ')[0]}</h1>
        </div>
        <div>
          <Button variant="outline-secondary" size="sm" onClick={resetDemo}>
            <i aria-hidden="true" className="bi bi-arrow-counterclockwise" />
            بازنشانی دمو
          </Button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        {stats.map((s) => (
          <div className="col-6 col-lg-3" key={s.label}>
            <Card className="bm-card h-100">
              <Card.Body>
                <div className="stat-card p-0">
                  <div className="stat-icon bg-soft-primary mb-2">
                    <i aria-hidden="true" className={`bi ${s.icon} ${s.tone}`} />
                  </div>
                  <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                    {s.label}
                  </div>
                  <div className="stat-value">{s.value}</div>
                  <div className="text-muted-bm" style={{ fontSize: '0.75rem' }}>
                    {s.hint}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <Button variant="primary" size="lg" className="w-100 h-100" onClick={() => navigate('/admin/issue')}>
            <i aria-hidden="true" className="bi bi-cash-stack" />
            صدور شارژ ماهانه
          </Button>
        </div>
        <div className="col-12 col-md-4">
          <Button variant="outline-primary" size="lg" className="w-100 h-100" onClick={() => navigate('/admin/expenses')}>
            <i aria-hidden="true" className="bi bi-plus-circle" />
            ثبت هزینه
          </Button>
        </div>
        <div className="col-12 col-md-4">
          <Button variant="outline-primary" size="lg" className="w-100 h-100" onClick={() => navigate('/admin/announce')}>
            <i aria-hidden="true" className="bi bi-megaphone" />
            اطلاعیه جدید
          </Button>
        </div>
      </div>

      {awaitingCount > 0 && (
        <Card className="bm-card border-0 status-amber mb-3">
          <Card.Body className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-3">
              <i aria-hidden="true" className="bi bi-hourglass-split fs-3" />
              <div>
                <div className="fw-bold">{toFaDigits(awaitingCount)} رسید در انتظار تأیید</div>
                <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                  با تأیید یک‌دکمه‌ای، پرداخت ثبت و به ساکن پیامک می‌شود.
                </div>
              </div>
            </div>
            <Link className="btn btn-primary" to="/admin/units">
              بررسی و تأیید
            </Link>
          </Card.Body>
        </Card>
      )}

      <Card className="bm-card">
        <Card.Header className="bg-transparent fw-bold">
          درخواست‌های تعمیر باز
          <Link to="/admin/requests" className="float-start small text-decoration-none pt-1">
            همه
            <i aria-hidden="true" className="bi bi-chevron-left ms-1" />
          </Link>
        </Card.Header>
        <Card.Body className="p-0">
          {openRequests.length === 0 && (
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-check2-all empty-icon" />
              <div className="fw-bold text-dark">درخواست بازی نیست</div>
            </div>
          )}
          {openRequests.slice(0, 4).map((r) => (
            <Link
              key={r.id}
              to={`/admin/requests/${r.id}`}
              className="d-flex justify-content-between align-items-center gap-2 px-3 py-3 text-decoration-none border-top"
            >
              <div className="list-row">
                <span className="list-icon bg-soft-primary text-primary">
                  <i aria-hidden="true" className="bi bi-tools" />
                </span>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                    {r.category} · واحد {toFaDigits(r.unitNum)}
                  </div>
                  <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                    {r.description.slice(0, 60)}
                  </div>
                </div>
              </div>
              <RequestStatusPill status={r.status} />
            </Link>
          ))}
        </Card.Body>
      </Card>
    </div>
  )
}