const faDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

export function toFaDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => faDigits[Number(d)])
}

export function formatToman(amount: number): string {
  return toFaDigits(Math.round(amount).toLocaleString('en-US')) + ' تومان'
}

export function formatShortToman(amount: number): string {
  if (amount >= 1_000_000) {
    return toFaDigits((amount / 1_000_000).toLocaleString('en-US', { maximumFractionDigits: 1 })) + ' میلیون'
  }
  if (amount >= 1_000) {
    return toFaDigits(Math.round(amount / 1_000).toLocaleString('en-US')) + ' هزار'
  }
  return toFaDigits(amount)
}

export function formatDate(dateStr: string): string {
  return toFaDigits(dateStr)
}

export const DEMO_CODE = '1234'