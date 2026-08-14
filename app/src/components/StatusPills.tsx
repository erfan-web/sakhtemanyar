import type { ChargeStatus, RequestStatus } from '../types'
import { chargeStatusMeta, requestStatusMeta } from '../lib/labels'

export function ChargeStatusPill({ status }: { status: ChargeStatus }) {
  const meta = chargeStatusMeta[status]
  return (
    <span className={`status-pill ${meta.cls}`}>
      <span className={`dot ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

export function RequestStatusPill({ status }: { status: RequestStatus }) {
  const meta = requestStatusMeta[status]
  return (
    <span className={`status-pill ${meta.cls}`}>
      <i aria-hidden="true" className={`bi ${meta.icon}`} />
      {meta.label}
    </span>
  )
}