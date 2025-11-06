"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileText, Calendar } from "lucide-react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Pie,
  PieChart,
  Cell,
  Legend,
} from "recharts"
import { mockTransactions } from "@/lib/mock-data"
import { exportReportToPDF } from "@/lib/pdf-export"

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

const calculateFinancialData = (year: string) => {
  const filteredTransactions = mockTransactions.filter((t) => {
    const transactionYear = new Date(t.date).getFullYear().toString()
    return transactionYear === year
  })

  const incomeTransactions = filteredTransactions.filter((t) => t.type === "income")
  const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense")

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

  // Group expenses by category
  const expensesByCategory: Record<string, number> = {}
  expenseTransactions.forEach((t) => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
  })

  // Group income by category
  const incomeByCategory: Record<string, number> = {}
  incomeTransactions.forEach((t) => {
    incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount
  })

  const cashFlowByMonth: Record<string, { operasional: number; investasi: number; pendanaan: number }> = {}

  filteredTransactions.forEach((t) => {
    const date = new Date(t.date)
    const monthKey = date.toLocaleString("id-ID", { month: "short", year: "numeric" })

    if (!cashFlowByMonth[monthKey]) {
      cashFlowByMonth[monthKey] = { operasional: 0, investasi: 0, pendanaan: 0 }
    }

    if (t.type === "income") {
      cashFlowByMonth[monthKey].operasional += t.amount
    } else {
      cashFlowByMonth[monthKey].operasional -= t.amount
    }
  })

  const cashFlowData = Object.entries(cashFlowByMonth).map(([month, data]) => ({
    month,
    operasional: data.operasional,
    investasi: data.investasi,
    pendanaan: data.pendanaan,
  }))

  return {
    totalIncome,
    totalExpense,
    netIncome: totalIncome - totalExpense,
    expensesByCategory,
    incomeByCategory,
    cashFlowData,
  }
}

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("all")

  const financialData = calculateFinancialData(selectedPeriod)
  const { totalIncome, totalExpense, netIncome, expensesByCategory, incomeByCategory, cashFlowData } = financialData

  const profitMargin = totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(2) : "0"

  const expenseBreakdown = Object.entries(expensesByCategory).map(([name, value], index) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"]
    return {
      name,
      value,
      color: colors[index % colors.length],
    }
  })

  const taxRate = 0.005
  const taxAmount = Math.round(totalIncome * taxRate)

  const handleExportIncomeStatement = async () => {
    const element = document.getElementById("income-statement-report")
    if (element) {
      await exportReportToPDF("income-statement", selectedPeriod)
    } else {
      console.error("[v0] Element income-statement-report not found")
    }
  }

  const handleExportCashFlow = async () => {
    const element = document.getElementById("cash-flow-report")
    if (element) {
      await exportReportToPDF("cash-flow", selectedPeriod)
    } else {
      console.error("[v0] Element cash-flow-report not found")
    }
  }

  const handleExportTaxReport = async () => {
    const element = document.getElementById("tax-report")
    if (element) {
      await exportReportToPDF("tax", selectedPeriod)
    } else {
      console.error("[v0] Element tax-report not found")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
            <p className="text-muted-foreground">Laporan lengkap untuk analisis bisnis Anda</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportIncomeStatement}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="income-statement" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income-statement">Laba Rugi</TabsTrigger>
            <TabsTrigger value="cash-flow">Arus Kas</TabsTrigger>
            <TabsTrigger value="tax">Laporan Pajak</TabsTrigger>
          </TabsList>

          {/* Income Statement Tab */}
          <TabsContent value="income-statement" className="space-y-4">
            <div id="income-statement-report">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Pendapatan</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalIncome)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Total Beban</p>
                      <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Laba Bersih</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(netIncome)}</p>
                      <p className="text-xs text-muted-foreground">Margin: {profitMargin}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Laporan Laba Rugi</CardTitle>
                    <CardDescription>Periode: Januari - Juni {selectedPeriod}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableBody>
                        <TableRow className="font-semibold">
                          <TableCell colSpan={2}>PENDAPATAN</TableCell>
                        </TableRow>
                        {Object.entries(incomeByCategory).map(([category, amount]) => (
                          <TableRow key={category}>
                            <TableCell className="pl-8">{category}</TableCell>
                            <TableCell className="text-right">{formatCurrency(amount as number)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-semibold border-t">
                          <TableCell>Total Pendapatan</TableCell>
                          <TableCell className="text-right text-blue-600">{formatCurrency(totalIncome)}</TableCell>
                        </TableRow>

                        <TableRow className="font-semibold border-t">
                          <TableCell colSpan={2}>BEBAN</TableCell>
                        </TableRow>
                        {Object.entries(expensesByCategory).map(([category, amount]) => (
                          <TableRow key={category}>
                            <TableCell className="pl-8">{category}</TableCell>
                            <TableCell className="text-right">{formatCurrency(amount as number)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="font-semibold border-t">
                          <TableCell>Total Beban</TableCell>
                          <TableCell className="text-right text-red-600">{formatCurrency(totalExpense)}</TableCell>
                        </TableRow>

                        <TableRow className="font-bold border-t-2 bg-muted/50">
                          <TableCell>LABA BERSIH</TableCell>
                          <TableCell className="text-right text-green-600">{formatCurrency(netIncome)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Komposisi Beban</CardTitle>
                    <CardDescription>Distribusi pengeluaran berdasarkan kategori</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {expenseBreakdown.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(item.value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Cash Flow Tab */}
          <TabsContent value="cash-flow" className="space-y-4">
            <div id="cash-flow-report">
              <Card>
                <CardHeader>
                  <CardTitle>Laporan Arus Kas</CardTitle>
                  <CardDescription>Periode: {selectedPeriod}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={cashFlowData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" tickFormatter={(value) => `${value / 1000000}jt`} />
                      <Tooltip
                        formatter={(value: number) => formatCurrency(value)}
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Legend />
                      <Bar dataKey="operasional" name="Operasional" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="investasi" name="Investasi" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pendanaan" name="Pendanaan" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rincian Arus Kas</CardTitle>
                  <CardDescription>Breakdown per kategori aktivitas</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Operasional</TableHead>
                        <TableHead className="text-right">Investasi</TableHead>
                        <TableHead className="text-right">Pendanaan</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashFlowData.map((item) => {
                        const total = item.operasional + item.investasi + item.pendanaan
                        return (
                          <TableRow key={item.month}>
                            <TableCell className="font-medium">{item.month}</TableCell>
                            <TableCell className="text-right text-blue-600">
                              {formatCurrency(item.operasional)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${item.investasi < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {formatCurrency(item.investasi)}
                            </TableCell>
                            <TableCell
                              className={`text-right ${item.pendanaan < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {formatCurrency(item.pendanaan)}
                            </TableCell>
                            <TableCell
                              className={`text-right font-semibold ${total < 0 ? "text-red-600" : "text-green-600"}`}
                            >
                              {formatCurrency(total)}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      <TableRow className="font-bold border-t-2 bg-muted/50">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.operasional, 0))}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.investasi, 0))}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.pendanaan, 0))}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(
                            cashFlowData.reduce(
                              (sum, item) => sum + item.operasional + item.investasi + item.pendanaan,
                              0,
                            ),
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tax Report Tab */}
          <TabsContent value="tax" className="space-y-4">
            <div id="tax-report">
              <Card>
                <CardHeader>
                  <CardTitle>Laporan Pajak Penghasilan (PPh)</CardTitle>
                  <CardDescription>Perhitungan PPh Final UMKM 0.5%</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-medium text-blue-900">Informasi PPh Final UMKM</p>
                          <p className="text-sm text-blue-700">
                            Berdasarkan PP 23 Tahun 2018, UMKM dengan omzet di bawah Rp 4.8 miliar per tahun dikenakan
                            PPh Final sebesar 0.5% dari omzet bruto.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Omzet Bruto (Pendapatan Kotor)</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(totalIncome)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tarif PPh Final UMKM</TableCell>
                          <TableCell className="text-right font-semibold">{(taxRate * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 bg-muted/50">
                          <TableCell className="font-bold">PPh Final Terutang</TableCell>
                          <TableCell className="text-right font-bold text-red-600">
                            {formatCurrency(taxAmount)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Perhitungan:</h4>
                      <div className="rounded-lg bg-muted p-4 space-y-2 font-mono text-sm">
                        <div>Omzet Bruto = {formatCurrency(totalIncome)}</div>
                        <div>PPh Final = Omzet Bruto × {(taxRate * 100).toFixed(1)}%</div>
                        <div>
                          PPh Final = {formatCurrency(totalIncome)} × {(taxRate * 100).toFixed(1)}%
                        </div>
                        <div className="font-bold text-red-600 pt-2 border-t">
                          PPh Final = {formatCurrency(taxAmount)}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-3">
                      <h4 className="font-semibold">Kewajiban Pelaporan:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Setor PPh Final paling lambat tanggal 15 bulan berikutnya</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Lapor SPT Masa PPh Final paling lambat tanggal 20 bulan berikutnya</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>Lapor SPT Tahunan paling lambat 31 Maret tahun berikutnya</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button className="gap-2" onClick={handleExportTaxReport}>
                        <Download className="h-4 w-4" />
                        Download Laporan Pajak
                      </Button>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <FileText className="h-4 w-4" />
                        Cetak Bukti Potong
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Riwayat Pembayaran Pajak</CardTitle>
                  <CardDescription>Berdasarkan data transaksi</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Omzet</TableHead>
                        <TableHead className="text-right">PPh Final</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal Bayar</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cashFlowData.map((item, index) => {
                        const monthOmzet = mockTransactions
                          .filter((t) => {
                            const date = new Date(t.date)
                            const monthKey = date.toLocaleString("id-ID", { month: "short", year: "numeric" })
                            return monthKey === item.month && t.type === "income"
                          })
                          .reduce((sum, t) => sum + t.amount, 0)

                        const monthTax = Math.round(monthOmzet * taxRate)
                        const isLatest = index === cashFlowData.length - 1

                        return (
                          <TableRow key={item.month}>
                            <TableCell className="font-medium">{item.month}</TableCell>
                            <TableCell className="text-right">{formatCurrency(monthOmzet)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(monthTax)}</TableCell>
                            <TableCell>
                              {isLatest ? (
                                <span className="inline-flex items-center gap-1 text-orange-600 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-orange-600" />
                                  Belum Bayar
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                                  <div className="w-2 h-2 rounded-full bg-green-600" />
                                  Lunas
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {isLatest ? "-" : "Sudah dibayar"}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
