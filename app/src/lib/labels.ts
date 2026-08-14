import type { ChargeStatus, RequestStatus, UnitStatus } from '../types'

export const unitStatusMeta: Record<UnitStatus, { label: string; cls: string; dot: string }> & {
  issued: { label: string; cls: string; dot: string }
} = {
  paid: { label: 'پرداخت', cls: 'status-green', dot: 'dot-green' },
  awaiting: { label: 'در انتظار تأیید', cls: 'status-amber', dot: 'dot-amber' },
  issued: { label: 'در انتظار پرداخت', cls: 'status-blue', dot: 'dot-blue' },
  debt: { label: 'بدهکار', cls: 'status-red', dot: 'dot-red' },
}

export const chargeStatusMeta: Record<ChargeStatus, { label: string; cls: string; dot: string }> = {
  paid: { label: 'پرداخت', cls: 'status-green', dot: 'dot-green' },
  awaiting: { label: 'در انتظار تأیید', cls: 'status-amber', dot: 'dot-amber' },
  issued: { label: 'در انتظار پرداخت', cls: 'status-blue', dot: 'dot-blue' },
  debt: { label: 'بدهکار', cls: 'status-red', dot: 'dot-red' },
}

export const requestStatusMeta: Record<RequestStatus, { label: string; cls: string; dot: string; icon: string }> = {
  open: { label: 'باز', cls: 'status-amber', dot: 'dot-amber', icon: 'bi-clipboard2-plus' },
  in_progress: { label: 'در حال انجام', cls: 'status-blue', dot: 'dot-blue', icon: 'bi-gear-wide-connected' },
  done: { label: 'انجام شد', cls: 'status-green', dot: 'dot-green', icon: 'bi-check2-circle' },
}

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  open: 'باز',
  in_progress: 'در حال انجام',
  done: 'انجام شد',
}