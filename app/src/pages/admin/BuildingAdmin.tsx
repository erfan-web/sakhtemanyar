import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { toFaDigits } from '../../lib/format'
import { ChargeStatusPill } from '../../components/StatusPills'
import type { Utility } from '../../types'

const UTILITY_LABELS: Record<Utility, string> = { water: 'آب', electricity: 'برق', gas: 'گاز' }

export default function BuildingAdmin() {
  const { building, units, resetDemo } = useApp()

  const sharedSummary = (Object.keys(building.utilityConfig) as Utility[])
    .filter((u) => building.utilityConfig[u] === 'shared')
    .map((u) => UTILITY_LABELS[u])
    .join('، ')

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">ساختمان</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          واحدها، ساکنین و تنظیمات
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <Card className="bm-card h-100">
            <Card.Body>
              <div className="section-eyebrow mb-2">مشخصات ساختمان</div>
              <div className="fw-bold fs-5 mb-1">{building.name}</div>
              <div className="text-muted-bm mb-1">{building.address}</div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                ماه جاری: {building.month}
              </div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                روش تقسیم شارژ:{' '}
                {building.divisionMethod === 'area' ? 'متراژ' : building.divisionMethod === 'persons' ? 'نفرات' : 'تساوی'}
              </div>
              <div className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                قبوض مشترک در شارژ: {sharedSummary || '—'}
              </div>
              <Link to="/admin/utilities" className="btn btn-outline-primary btn-sm mt-2">
                <i aria-hidden="true" className="bi bi-plugin ms-1" />
                تنظیم قبوض و کنتور
              </Link>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-md-6">
          <Card className="bm-card h-100">
            <Card.Body>
              <div className="section-eyebrow mb-2">راه‌اندازی و دمو</div>
              <p className="text-muted-bm" style={{ fontSize: '0.85rem' }}>
                برای دوباره راه‌اندازی با دادهٔ نمونه (مجتمع مهرشهر، ۱۸ واحد) و شروع دوباره، از دکمهٔ زیر استفاده
                کنید.
              </p>
              <Button variant="outline-secondary" onClick={resetDemo}>
                <i aria-hidden="true" className="bi bi-arrow-counterclockwise" />
                بازنشانی دادهٔ نمونه
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      <Card className="bm-card">
        <Card.Header className="bg-transparent fw-bold">
          واحدها ({toFaDigits(units.length)})
        </Card.Header>
        <Card.Body className="p-0">
          {units.map((u) => (
            <div key={u.id} className="d-flex justify-content-between align-items-center gap-2 px-3 py-2 border-top">
              <div className="list-row">
                <span className="list-icon bg-soft-primary text-primary fw-bold">و{u.num}</span>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                    {u.residentName}
                  </div>
                  <div className="text-muted-bm" style={{ fontSize: '0.78rem' }}>
                    {u.isOwner ? 'مالک' : 'مستأجر'}
                    {u.phone ? ` · ${toFaDigits(u.phone)}` : ''}
                  </div>
                </div>
              </div>
              <ChargeStatusPill status={u.chargeStatus} />
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  )
}