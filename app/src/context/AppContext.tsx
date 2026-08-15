import { createContext, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  Announcement,
  Building,
  ChargeStatus,
  DivisionMethod,
  Expense,
  MeterMode,
  OnboardingData,
  RepairRequest,
  Unit,
  Utility,
} from '../types'
import { BUILDING, INITIAL_ANNOUNCEMENTS, INITIAL_EXPENSES, INITIAL_REQUESTS, makeUnits } from '../data/mockData'
import { computeShares } from '../lib/charge'

interface Toast {
  id: number
  message: string
  kind: 'success' | 'danger' | 'info'
}

interface AppContextValue {
  building: Building
  units: Unit[]
  expenses: Expense[]
  requests: RepairRequest[]
  announcements: Announcement[]
  toasts: Toast[]
  pushToast: (message: string, kind?: Toast['kind']) => void
  issueMonthlyCharge: (budget: number) => void
  updateUtilityConfig: (utility: Utility, mode: MeterMode) => void
  setDivisionMethod: (method: DivisionMethod) => void
  approveReceipt: (unitId: number) => void
  rejectReceipt: (unitId: number) => void
  payCharge: (unitId: number, receipt: { trackingCode: string; note?: string }) => void
  addExpense: (expense: Omit<Expense, 'id' | 'at'>) => void
  addRequest: (req: Omit<RepairRequest, 'id' | 'createdAt' | 'status' | 'urgent' | 'unitNum' | 'residentName'>) => void
  updateRequest: (id: number, patch: Partial<Pick<RepairRequest, 'status' | 'assignee' | 'amount' | 'result'>>) => void
  addAnnouncement: (a: Omit<Announcement, 'id' | 'sentAt'>) => void
  completeOnboarding: (data: OnboardingData) => void
  resetDemo: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

interface PersistedState {
  building: Building
  units: Unit[]
  expenses: Expense[]
  requests: RepairRequest[]
  announcements: Announcement[]
}

const STORAGE_KEY = 'bm-state-v2'

function seedState(): PersistedState {
  return {
    building: BUILDING,
    units: makeUnits(),
    expenses: INITIAL_EXPENSES,
    requests: INITIAL_REQUESTS,
    announcements: INITIAL_ANNOUNCEMENTS,
  }
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed.units || !parsed.building) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const initial = useRef(loadState()).current
  const [building, setBuilding] = useState<Building>(initial.building)
  const [units, setUnits] = useState<Unit[]>(initial.units)
  const [expenses, setExpenses] = useState<Expense[]>(initial.expenses)
  const [requests, setRequests] = useState<RepairRequest[]>(initial.requests)
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial.announcements)
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastSeq = useRef(1)

  const persist = (next: PersistedState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage might be unavailable */
    }
  }

  const pushToast = (message: string, kind: Toast['kind'] = 'success') => {
    const id = toastSeq.current++
    setToasts((prev) => [...prev, { id, message, kind }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const value = useMemo<AppContextValue>(
    () => ({
      building,
      units,
      expenses,
      requests,
      announcements,
      toasts,
      pushToast,
      issueMonthlyCharge: (budget) => {
        const method = building.divisionMethod
        const items = computeShares(units, budget, method)
        const byId = new Map(items.map((i) => [i.unitId, i.amount]))
        setUnits((prev) =>
          prev.map((u) => ({
            ...u,
            chargeAmount: byId.get(u.id) ?? 0,
            chargeStatus: 'issued' as ChargeStatus,
            receipt: undefined,
          })),
        )
        pushToast(`شارژ ماهانه برای ${units.length} واحد صادر و پیامک شد`, 'success')
      },
      updateUtilityConfig: (utility, mode) => {
        setBuilding((prev) => ({
          ...prev,
          utilityConfig: { ...prev.utilityConfig, [utility]: mode },
        }))
        pushToast('نحوهٔ کنتور به‌روزرسانی شد', 'success')
      },
      setDivisionMethod: (method) => {
        setBuilding((prev) => ({ ...prev, divisionMethod: method }))
        pushToast('روش تقسیم شارژ به‌روزرسانی شد', 'success')
      },
      approveReceipt: (unitId) => {
        setUnits((prev) => prev.map((u) => (u.id === unitId ? { ...u, chargeStatus: 'paid' } : u)))
      },
      rejectReceipt: (unitId) => {
        setUnits((prev) =>
          prev.map((u) => (u.id === unitId ? { ...u, chargeStatus: 'issued', receipt: undefined } : u)),
        )
        pushToast('از ساکن خواسته شد رسید را اصلاح کند', 'info')
      },
      payCharge: (unitId, receipt) => {
        setUnits((prev) =>
          prev.map((u) =>
            u.id === unitId
              ? { ...u, chargeStatus: 'awaiting', receipt: { ...receipt, at: '۱۴ مرداد ۱۴۰۵' } }
              : u,
          ),
        )
        pushToast('رسید ثبت شد؛ در انتظار تأیید مدیر', 'success')
      },
      addExpense: (expense) => {
        const next = [...expenses, { ...expense, id: Date.now(), at: '۱۴ مرداد ۱۴۰۵' }]
        setExpenses(next)
        pushToast('هزینه ثبت شد', 'success')
      },
      addRequest: (req) => {
        const resident = units.find((u) => u.id === req.unitId)
        const next: RepairRequest = {
          ...req,
          id: Date.now(),
          createdAt: '۱۴ مرداد ۱۴۰۵',
          status: 'open',
          urgent: false,
          residentName: resident?.residentName ?? 'ساکن',
          unitNum: resident?.num ?? 0,
        }
        setRequests((prev) => [next, ...prev])
        pushToast('درخواست ثبت شد و به مدیر اطلاع داده شد', 'success')
      },
      updateRequest: (id, patch) => {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
      },
      addAnnouncement: (a) => {
        setAnnouncements((prev) => [{ ...a, id: Date.now(), sentAt: '۱۴ مرداد ۱۴۰۵' }, ...prev])
        pushToast('اطلاعیه ارسال شد', 'success')
      },
      completeOnboarding: (data) => {
        const newUnits: Unit[] = Array.from({ length: data.units }, (_, i) => ({
          id: i + 1,
          num: i + 1,
          residentName: 'ساکن',
          phone: '',
          isOwner: false,
          areaM2: data.areaM2,
          occupants: data.occupants,
          chargeAmount: null,
          chargeStatus: 'issued',
        }))
        setBuilding({
          name: data.name,
          address: data.address,
          month: 'مرداد ۱۴۰۵',
          divisionMethod: 'area',
          utilityConfig: {
            water: 'shared',
            electricity: 'separate',
            gas: 'separate',
          },
        })
        setUnits(newUnits)
        setExpenses([])
        setRequests([])
        setAnnouncements([])
        pushToast('ساختمان فعال شد. بفرمایید داخل', 'success')
      },
      resetDemo: () => {
        if (!window.confirm('همهٔ تغییرات دادهٔ نمونه بازنشانی می‌شود. ادامه می‌دهید؟')) return
        const fresh = seedState()
        setBuilding(fresh.building)
        setUnits(fresh.units)
        setExpenses(fresh.expenses)
        setRequests(fresh.requests)
        setAnnouncements(fresh.announcements)
        persist(fresh)
        pushToast('داده‌های نمونه بازنشانی شد', 'info')
      },
    }),
    [building, units, expenses, requests, announcements, toasts, persist, pushToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}