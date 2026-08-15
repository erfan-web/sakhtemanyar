import type { DivisionMethod, Unit } from '../types'

export function unitWeight(unit: Unit, method: DivisionMethod): number {
  if (method === 'area') return unit.areaM2
  if (method === 'persons') return unit.occupants
  return 1
}

export function totalWeight(units: Unit[], method: DivisionMethod): number {
  return units.reduce((sum, u) => sum + unitWeight(u, method), 0)
}

export function shareAmount(unit: Unit, budget: number, method: DivisionMethod, units: Unit[]): number {
  const tw = totalWeight(units, method)
  if (tw <= 0) return 0
  return Math.round((budget * unitWeight(unit, method)) / tw)
}

export function computeShares(units: Unit[], budget: number, method: DivisionMethod): { unitId: number; amount: number }[] {
  const tw = totalWeight(units, method)
  return units.map((u) => {
    const amount = tw > 0 ? Math.round((budget * unitWeight(u, method)) / tw) : 0
    return { unitId: u.id, amount }
  })
}

export function methodLabel(method: DivisionMethod): string {
  if (method === 'area') return 'سهم بر اساس متراژ (قانون تملک آپارتمان‌ها)'
  if (method === 'persons') return 'سهم بر اساس تعداد نفرات'
  return 'تساوی بین همهٔ واحدها'
}
