import { Card } from 'react-bootstrap'
import { useApp } from '../../context/AppContext'
import { toFaDigits } from '../../lib/format'
import type { MeterMode, Utility } from '../../types'

type ModeOption = { value: MeterMode; label: string; desc: string }

const MODE_OPTIONS: ModeOption[] = [
  { value: 'shared', label: 'مشترک', desc: 'یک کنتور برای کل ساختمان؛ مبلغ قبض بین واحدها تقسیم می‌شود.' },
  {
    value: 'separate',
    label: 'مستقل هر واحد',
    desc: 'هر واحد کنتور خود را دارد و مستقیم به اداره می‌پردازد. سهم مشاعات همچنان مشترک است.',
  },
]

const UTILITY_META: Record<Utility, { label: string; icon: string }> = {
  water: { label: 'آب', icon: 'bi-droplet-half' },
  electricity: { label: 'برق', icon: 'bi-lightning-charge' },
  gas: { label: 'گاز', icon: 'bi-fire' },
}

export default function Utilities() {
  const { building, units, updateUtilityConfig } = useApp()

  const sharedCount = (Object.keys(building.utilityConfig) as Utility[]).filter(
    (u) => building.utilityConfig[u] === 'shared',
  ).length

  return (
    <div>
      <div className="mb-3">
        <h1 className="page-title mb-0">قبوض و کنتور</h1>
        <div className="text-muted-bm" style={{ fontSize: '0.8rem' }}>
          نحوهٔ کنتور آب، برق و گاز را یک‌بار مشخص کنید؛ بر همین اساس محاسبهٔ شارژ انجام می‌شود.
        </div>
      </div>

      <Card className="bm-card mb-3">
        <Card.Header className="bg-transparent fw-bold">
          {toFaDigits(sharedCount)} قبوض در شارژ | {toFaDigits(units.length)} واحد
        </Card.Header>
        <Card.Body>
          {(Object.keys(building.utilityConfig) as Utility[]).map((u) => (
            <div key={u} className="border-top py-3">
              <div className="fw-bold mb-2">
                <i aria-hidden="true" className={`bi ${UTILITY_META[u].icon} ms-2 text-primary`} />
                {UTILITY_META[u].label}
              </div>
              <div className="d-flex flex-column gap-2">
                {MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`btn text-start ${building.utilityConfig[u] === opt.value ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                    onClick={() => updateUtilityConfig(u, opt.value)}
                    style={{ whiteSpace: 'normal' }}
                  >
                    <div className="fw-bold">{opt.label}</div>
                    <div className="small opacity-75">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  )
}