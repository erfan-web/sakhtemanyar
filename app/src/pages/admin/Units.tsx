import { useMemo, useState } from 'react'
import { Button, Card, Nav, Row, Col } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { formatToman, toFaDigits } from '../../lib/format'
import type { ChargeStatus } from '../../types'
import { ChargeStatusPill } from '../../components/StatusPills'

type Filter = 'all' | ChargeStatus

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'awaiting', label: 'در انتظار تأیید' },
  { key: 'paid', label: 'پرداخت' },
  { key: 'issued', label: 'در انتظار پرداخت' },
  { key: 'debt', label: 'بدهکار' },
]

export default function Units() {
  const { units, building, approveReceipt, rejectReceipt } = useApp()
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? units : units.filter((u) => u.chargeStatus === filter)),
    [units, filter],
  )

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: units.length }
    for (const u of units) c[u.chargeStatus] = (c[u.chargeStatus] ?? 0) + 1
    return c
  }, [units])

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">وضعیت واحدها</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          شارژ {building.month} — {toFaDigits(units.length)} واحد
        </div>
      </div>

      <Nav variant="pills" className="mb-3 gap-1 flex-nowrap overflow-auto">
        {filters.map((f) => (
          <Nav.Item key={f.key}>
            <Nav.Link
              className={filter === f.key ? 'bg-primary text-white' : 'text-muted-bm'}
              onClick={() => setFilter(f.key)}
              active={filter === f.key}
              href="#"
            >
              {f.label}
              <span className="ms-1 small opacity-75">({toFaDigits(counts[f.key] ?? 0)})</span>
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {filtered.length === 0 && (
        <Card className="bm-card">
          <Card.Body>
            <div className="empty-state">
              <i aria-hidden="true" className="bi bi-people empty-icon" />
              <div className="fw-bold text-dark">واحدی در این وضعیت نیست</div>
            </div>
          </Card.Body>
        </Card>
      )}

      <Row xs={1} md={2} xl={3} className="g-3">
        {filtered.map((u) => (
          <Col key={u.id}>
            <Card className="bm-card h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-bold fs-5">واحد {toFaDigits(u.num)}</div>
                  <ChargeStatusPill status={u.chargeStatus} />
                </div>
                <div className="text-muted-bm mb-1" style={{ fontSize: '0.85rem' }}>
                  {u.residentName}
                  {u.isOwner ? ' · مالک' : ' · مستأجر'}
                </div>
                <div className="fw-bold mb-2">{formatToman(u.chargeAmount ?? building.defaultCharge)}</div>

                {u.chargeStatus === 'awaiting' && u.receipt && (
                  <div className="status-amber rounded-3 p-3 mb-2">
                    <div className="fw-bold" style={{ fontSize: '0.85rem' }}>
                      رسید ثبت‌شده
                    </div>
                    <div className="small" style={{ fontSize: '0.8rem' }}>
                      پیگیری: {u.receipt.trackingCode}
                      <br />
                      {u.receipt.note ? u.receipt.note : 'بدون یادداشت'} · {u.receipt.at}
                    </div>
                    <div className="d-grid gap-2 mt-2">
                      <Button size="sm" variant="success" onClick={() => approveReceipt(u.id)}>
                        <i aria-hidden="true" className="bi bi-check-lg" />
                        تأیید و ثبت پرداخت
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => rejectReceipt(u.id)}>
                        رد و درخواست اصلاح
                      </Button>
                    </div>
                  </div>
                )}

                {u.chargeStatus === 'debt' && (
                  <div className="status-red rounded-3 p-2 small">دو ماه تسویه‌نشده — با ساکن تماس بگیرید.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}