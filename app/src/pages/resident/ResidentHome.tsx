import { Button, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useApp } from '../../context/AppContext'
import { formatShortToman, formatToman } from '../../lib/format'
import { ChargeStatusPill, RequestStatusPill } from '../../components/StatusPills'

export default function ResidentHome() {
  const { user } = useAuth()
  const { units, requests, announcements, building } = useApp()
  const navigate = useNavigate()
  const unit = units.find((u) => u.id === user?.unitId)

  const myRequests = requests.filter((r) => r.unitId === user?.unitId)
  const latestRequest = myRequests[0]
  const latestAnnouncement = announcements[0]

  if (!unit) return null

  return (
    <div>
      <div className="mb-3">
        <div className="section-eyebrow">{building.name}</div>
        <h1 className="page-title mb-0">سلام، {unit.residentName}</h1>
      </div>

      <Card className="bm-card border-0 overflow-hidden mb-3">
        <Card.Body className="p-0">
          <div
            className="p-4 text-white"
            style={{ background: 'linear-gradient(135deg, var(--bm-primary), var(--bm-primary-strong))' }}
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="opacity-75" style={{ fontSize: '0.8rem' }}>
                  شارژ {building.month}
                </div>
                <div className="fs-2 fw-bold mt-1">{formatToman(unit.chargeAmount ?? 0)}</div>
                <div className="opacity-75" style={{ fontSize: '0.8rem' }}>
                  مهلت پرداخت: پایان {building.month}
                </div>
              </div>
              <span
                className="badge text-bg-light rounded-pill px-3 py-2"
                style={{ fontWeight: 700 }}
              >
                واحد {unit.num}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 mt-3 text-white">
              <ChargeStatusPill status={unit.chargeStatus} />
            </div>
          </div>
        </Card.Body>
      </Card>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <Card className="bm-card h-100">
            <Card.Body>
              <div className="stat-card p-0">
                <div className="stat-icon bg-soft-primary text-primary mb-2">
                  <i aria-hidden="true" className="bi bi-wallet2" />
                </div>
                <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                  شارژ من
                </div>
                <div className="stat-value">
                  {formatShortToman(unit.chargeAmount ?? 0)}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-6">
          <Card className="bm-card h-100">
            <Card.Body>
              <div className="stat-card p-0">
                <div className="stat-icon bg-soft-primary text-primary mb-2">
                  <i aria-hidden="true" className="bi bi-tools" />
                </div>
                <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
                  درخواست‌های من
                </div>
                <div className="stat-value">{myRequests.length}</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {unit.chargeStatus === 'awaiting' && unit.receipt && (
        <Card className="bm-card border-0 status-amber mb-3">
          <Card.Body className="d-flex align-items-start gap-3">
            <i aria-hidden="true" className="bi bi-hourglass-split fs-3" />
            <div>
              <div className="fw-bold">رسید شما در انتظار تأیید است</div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                شماره پیگیری: {unit.receipt.trackingCode} — به محض تأیید مدیر، وضعیت پرداخت سبز می‌شود.
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {unit.chargeStatus !== 'paid' && unit.chargeStatus !== 'awaiting' && (
        <Card className="bm-card mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <div>
                <div className="fw-bold">شارژ {building.month} هنوز پرداخت نشده</div>
                <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                  کارت‌به‌کارت پرداخت کنید و رسید را ثبت کنید تا مدیر تأیید کند.
                </div>
              </div>
              <Button onClick={() => navigate('/resident/charge')} variant="primary" size="lg">
                پرداخت شارژ
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {latestRequest && (
        <Card className="bm-card mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold">
                <i aria-hidden="true" className="bi bi-tools ms-2 text-primary" />
                آخرین درخواست تعمیر
              </div>
              <RequestStatusPill status={latestRequest.status} />
            </div>
            <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
              {latestRequest.category} — {latestRequest.description.slice(0, 70)}…
            </div>
          </Card.Body>
        </Card>
      )}

      {latestAnnouncement && (
        <Link to={`/resident/announcements/${latestAnnouncement.id}`} className="text-decoration-none">
          <Card className={`bm-card mb-3 ${latestAnnouncement.urgent ? 'border-warning' : ''}`}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="fw-bold">
                  {latestAnnouncement.urgent && (
                    <span className="status-pill status-red ms-2">
                      <i aria-hidden="true" className="bi bi-exclamation-triangle-fill" />
                      فوری
                    </span>
                  )}
                  {latestAnnouncement.title}
                </div>
                <i aria-hidden="true" className="bi bi-chevron-left text-muted-bm" />
              </div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                {latestAnnouncement.sentAt}
              </div>
            </Card.Body>
          </Card>
        </Link>
      )}
    </div>
  )
}