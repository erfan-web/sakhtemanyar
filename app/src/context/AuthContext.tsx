import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Role, User } from '../types'
import { DEMO_CODE } from '../lib/format'

export const ADMIN_PHONE = '09120000001'
const RESIDENT_PHONE = '09120000005'

const ADMIN_USER: User = { name: 'کریم خان قاسمی', role: 'admin', phone: ADMIN_PHONE }
const RESIDENT_USER: User = { name: 'فرشته احمدی', role: 'resident', unitId: 5, phone: RESIDENT_PHONE }

interface AuthContextValue {
  user: User | null
  pendingPhone: string | null
  requestCode: (phone: string) => boolean
  verifyCode: (code: string) => boolean
  loginAs: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function resolveByPhone(phone: string): User | null {
  if (phone === ADMIN_PHONE) return ADMIN_USER
  if (phone === RESIDENT_PHONE) return RESIDENT_USER
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bm-user')
    return saved ? (JSON.parse(saved) as User) : null
  })
  const [pendingPhone, setPendingPhone] = useState<string | null>(null)

  const requestCode = (phone: string) => {
    const recognized = resolveByPhone(phone) !== null
    if (recognized) setPendingPhone(phone)
    return recognized
  }

  const verifyCode = (code: string) => {
    if (code !== DEMO_CODE || !pendingPhone) return false
    const found = resolveByPhone(pendingPhone)
    if (!found) return false
    setUser(found)
    localStorage.setItem('bm-user', JSON.stringify(found))
    setPendingPhone(null)
    return true
  }

  const loginAs = (role: Role) => {
    const next = role === 'admin' ? ADMIN_USER : RESIDENT_USER
    setUser(next)
    localStorage.setItem('bm-user', JSON.stringify(next))
    setPendingPhone(null)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bm-user')
  }

  const value = useMemo(
    () => ({ user, pendingPhone, requestCode, verifyCode, loginAs, logout }),
    [user, pendingPhone],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}