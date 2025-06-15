import dayjs from 'dayjs'

export function getStartOfWeek(dateInput: string | Date) {
    const date = dayjs(dateInput)
    const day = date.day() === 0 ? 7 : date.day() // 1 = Senin, 7 = Minggu
    return date.subtract(day - 1, 'day').startOf('day')// Return: dayjs('YYYY-MM-Monday 00:00:00.000')
}

export function getEndOfWeek(dateInput: string | Date) {
    const monday = getStartOfWeek(dateInput)
    return monday.add(6, 'day').endOf('day')// Return: dayjs('YYYY-MM-Sunday 23:59:59.999')
}

export function getStartOfMonth(dateInput: string | Date) {
    return dayjs(dateInput).startOf('month') // awal bulan: YYYY-MM-01 00:00:00.000
}

export function getEndOfMonth(dateInput: string | Date) {
    return dayjs(dateInput).endOf('month') // akhir bulan: YYYY-MM-lastDay 23:59:59.999
}

export function getExpiredDateFromMonth(dateInput: string | Date, period = 1) {
    return getStartOfMonth(dateInput).add(period, 'month').endOf('day').format('YYYY-MM-DD HH:mm:ss')
}

export function getExpiredDateFromWeek(dateInput: string | Date, period = 1) {
    return getStartOfWeek(dateInput).add(period, 'week').endOf('day').format('YYYY-MM-DD HH:mm:ss')
}