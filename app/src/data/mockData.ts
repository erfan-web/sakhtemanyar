import type { Announcement, Building, Expense, RepairRequest, Unit } from '../types'

export const BUILDING: Building = {
  name: 'مجتمع مهرشهر',
  address: 'کرج، مهرشهر، بلوار کاج',
  month: 'مرداد ۱۴۰۵',
  divisionMethod: 'area',
  utilityConfig: {
    water: 'shared',
    electricity: 'separate',
    gas: 'separate',
  },
}

const names: { name: string; isOwner: boolean; paid: boolean; debt: boolean }[] = [
  { name: 'اکبر رضایی', isOwner: true, paid: true, debt: false },
  { name: 'مینا کریمی', isOwner: false, paid: true, debt: false },
  { name: 'حسین قاسمی', isOwner: true, paid: true, debt: false },
  { name: 'زهرا محمدی', isOwner: true, paid: false, debt: true },
  { name: 'فرشته احمدی', isOwner: false, paid: false, debt: false },
  { name: 'رضا نوروزی', isOwner: true, paid: true, debt: false },
  { name: 'سارا حسینی', isOwner: false, paid: true, debt: false },
  { name: 'محمد صادقی', isOwner: true, paid: true, debt: false },
  { name: 'لیلا موسوی', isOwner: true, paid: false, debt: false },
  { name: 'امیر تهرانی', isOwner: true, paid: true, debt: false },
  { name: 'نگار جعفری', isOwner: false, paid: true, debt: false },
  { name: 'حسن عزیزی', isOwner: true, paid: false, debt: true },
  { name: 'فاطمه کاظمی', isOwner: true, paid: true, debt: false },
  { name: 'مهدی شریفی', isOwner: true, paid: true, debt: false },
  { name: 'آزاده رحیمی', isOwner: true, paid: false, debt: false },
  { name: 'بهنام خانی', isOwner: true, paid: true, debt: false },
  { name: 'سودابه نادری', isOwner: true, paid: true, debt: false },
  { name: 'علی مرادی', isOwner: true, paid: false, debt: true },
]

function phoneFor(num: number): string {
  return `0912000${String(100 + num).slice(-4)}`
}

const areas = [68, 72, 80, 85, 92, 98, 104, 110, 118, 125, 132, 140, 148, 155, 162, 170, 178, 185]

function areaFor(num: number): number {
  return areas[(num - 1) % areas.length]
}

function occupantsFor(num: number): number {
  return (num % 3) + 1
}

export function makeUnits(): Unit[] {
  return names.map((n, i) => {
    const num = i + 1
    const unit: Unit = {
      id: num,
      num,
      residentName: n.name,
      phone: phoneFor(num),
      isOwner: n.isOwner,
      areaM2: areaFor(num),
      occupants: occupantsFor(num),
      chargeAmount: null,
      chargeStatus: n.paid ? 'paid' : n.debt ? 'debt' : 'awaiting',
    }
    if (unit.chargeStatus === 'awaiting') {
      unit.receipt = {
        trackingCode: 'CARDBEH-' + (700 + num * 13),
        note: 'از کارت به کارت بانک ملت',
        at: `۲ مرداد ۱۴۰۵`,
      }
    }
    return unit
  })
}

export const INITIAL_EXPENSES: Expense[] = [
  { id: 1, category: 'حقوق نگهبان', amount: 4_500_000, note: 'حقوق ماه مرداد — آقای سلیمانی', at: '۱ مرداد ۱۴۰۵' },
  { id: 2, category: 'آب مشترک', amount: 2_100_000, note: 'قبض آب چاه مشترک', at: '۵ مرداد ۱۴۰۵' },
  { id: 3, category: 'تعمیر و نگهداری', amount: 850_000, note: 'لمپ پارکینگ + درب ضدسرقت', at: '۱۰ مرداد ۱۴۰۵' },
  { id: 4, category: 'نظافت', amount: 1_800_000, note: 'خدمات نظافت لابی و پله‌ها', at: '۱۲ مرداد ۱۴۰۵' },
]

export const INITIAL_REQUESTS: RepairRequest[] = [
  {
    id: 1,
    unitId: 8,
    unitNum: 8,
    residentName: 'محمد صادقی',
    category: 'آسانسور',
    description: 'آسانسور در طبقه همکف گیر کرده و باز نمی‌شود. ساعت ۱۸ اتفاق افتاد.',
    status: 'open',
    createdAt: '۱۴ مرداد ۱۴۰۵',
    urgent: true,
  },
  {
    id: 2,
    unitId: 3,
    unitNum: 3,
    residentName: 'حسین قاسمی',
    category: 'لوله‌کشی',
    description: 'نشتی آب از سقف سرویس واحد — احتمالاً لوله رایزر طبقه چهارم.',
    status: 'in_progress',
    createdAt: '۱۲ مرداد ۱۴۰۵',
    urgent: true,
    assignee: 'لوله‌کش صادقی',
  },
  {
    id: 3,
    unitId: 11,
    unitNum: 11,
    residentName: 'نگار جعفری',
    category: 'برق',
    description: 'کلید مینیاتوری پارکینگ مرتباً می‌پرد.',
    status: 'done',
    createdAt: '۵ مرداد ۱۴۰۵',
    assignee: 'برقکار',
    amount: 400_000,
    result: 'جایگزینی کلید + رفع اتصال انجام شد.',
    urgent: false,
  },
  {
    id: 4,
    unitId: 16,
    unitNum: 16,
    residentName: 'بهنام خانی',
    category: 'سایر',
    description: 'شیشه راه‌پله طبقه دوم ترک برداشته، نیاز به تعویض.',
    status: 'done',
    createdAt: '۲ مرداد ۱۴۰۵',
    assignee: 'شیشه‌بر',
    amount: 650_000,
    result: 'شیشه تعویض شد.',
    urgent: false,
  },
]

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    title: 'آزمایش سیستم اطفای حریق',
    body: 'پنجشنبه ساعت ۱۰ صبح آزمایش سامانه اطفای حریق انجام می‌شود. لطفاً آسانسور را استفاده نکنید و در صورت شنیدن آژیر نگران نباشید.',
    urgent: false,
    sentAt: '۱۲ مرداد ۱۴۰۵',
  },
  {
    id: 2,
    title: 'قطع آب موقت',
    body: 'به دلیل تعمیر لوله رایزر، آب مشترک روز دوشنبه از ساعت ۹ تا ۱۲ قطع است. لطفاً ذخیره کافی داشته باشید.',
    urgent: true,
    sentAt: '۱۰ مرداد ۱۴۰۵',
  },
  {
    id: 3,
    title: 'جمع‌بندی هزینه‌های تیر ماه',
    body: 'صورت‌وضعیت کامل هزینه‌ها و دریافتی‌های تیرماه به پیوست اطلاعیه‌ها اضافه شد. برای سؤال به مدیر ساختمان پیام دهید.',
    urgent: false,
    sentAt: '۵ مرداد ۱۴۰۵',
  },
]

export const REQUEST_CATEGORIES = ['آسانسور', 'لوله‌کشی', 'برق', 'گاز', 'نمای ساختمان', 'سایر']

export const EXPENSE_CATEGORIES = [
  'حقوق نگهبان',
  'آب مشترک',
  'برق مشترک',
  'نظافت',
  'تعمیر و نگهداری',
  'آسانسور',
  'سایر',
]
