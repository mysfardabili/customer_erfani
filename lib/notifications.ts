export interface Notification {
  id: string
  type: "overdue" | "due-soon" | "reminder"
  title: string
  message: string
  timestamp: Date
  read: boolean
  debtId?: number
}

export function checkOverdueDebts(debts: any[]): Notification[] {
  const notifications: Notification[] = []
  const today = new Date()

  debts.forEach((debt) => {
    const dueDate = new Date(debt.dueDate)
    const daysUntilDue = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (debt.status !== "paid") {
      if (daysUntilDue < 0) {
        notifications.push({
          id: `overdue-${debt.id}`,
          type: "overdue",
          title: `${debt.type === "receivable" ? "Piutang" : "Hutang"} Jatuh Tempo`,
          message: `${debt.contactName} - ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(debt.amount - debt.paidAmount)} (${Math.abs(daysUntilDue)} hari yang lalu)`,
          timestamp: new Date(),
          read: false,
          debtId: debt.id,
        })
      } else if (daysUntilDue <= 3 && daysUntilDue >= 0) {
        notifications.push({
          id: `due-soon-${debt.id}`,
          type: "due-soon",
          title: `${debt.type === "receivable" ? "Piutang" : "Hutang"} Akan Jatuh Tempo`,
          message: `${debt.contactName} - ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(debt.amount - debt.paidAmount)} (${daysUntilDue} hari lagi)`,
          timestamp: new Date(),
          read: false,
          debtId: debt.id,
        })
      }
    }
  })

  return notifications
}

export function getDailyReminder(): Notification | null {
  const today = new Date()
  const hour = today.getHours()

  if (hour === 9) {
    return {
      id: "daily-reminder",
      type: "reminder",
      title: "Pengingat Harian",
      message: "Jangan lupa untuk mencatat transaksi hari ini",
      timestamp: new Date(),
      read: false,
    }
  }

  return null
}
