export type Role = 'admin' | 'resident'

export type UnitStatus = 'paid' | 'awaiting' | 'debt'

export type ChargeStatus = 'issued' | 'paid' | 'awaiting' | 'debt'

export type RequestStatus = 'open' | 'in_progress' | 'done'

export type Utility = 'water' | 'electricity' | 'gas'

export type MeterMode = 'shared' | 'separate'

export type DivisionMethod = 'area' | 'persons' | 'equal'

export const UTILITIES: Utility[] = ['water', 'electricity', 'gas']

export interface User {
  name: string
  role: Role
  unitId?: number
  phone: string
}

export interface Unit {
  id: number
  num: number
  residentName: string
  phone: string
  isOwner: boolean
  areaM2: number
  occupants: number
  chargeAmount: number | null
  chargeStatus: ChargeStatus
  receipt?: {
    trackingCode: string
    note?: string
    at: string
  }
}

export interface Expense {
  id: number
  category: string
  amount: number
  note: string
  at: string
}

export interface RepairRequest {
  id: number
  unitId: number
  unitNum: number
  residentName: string
  category: string
  description: string
  status: RequestStatus
  createdAt: string
  assignee?: string
  amount?: number
  result?: string
  urgent: boolean
}

export interface Announcement {
  id: number
  title: string
  body: string
  urgent: boolean
  sentAt: string
}

export interface Building {
  name: string
  address: string
  month: string
  divisionMethod: DivisionMethod
  utilityConfig: Record<Utility, MeterMode>
}

export interface ChargeIssue {
  method: DivisionMethod
  budget: number
  issuedAt: string
  month: string
  items: { unitId: number; amount: number }[]
}

export interface OnboardingData {
  name: string
  units: number
  address: string
  areaM2: number
  occupants: number
}