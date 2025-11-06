"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Wallet, DollarSign, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"
import { mockTransactions } from "@/lib/mock-data"

const monthlyData = [
  { month: "Jan", pemasukan: 45000000, pengeluaran: 32000000 },
  { month: "Feb", pemasukan: 52000000, pengeluaran: 35000000 },
  { month: "Mar", pemasukan: 48000000, pengeluaran: 38000000 },
  { month: "Apr", pemasukan: 61000000, pengeluaran: 42000000 },
  { month: "Mei", pemasukan: 55000000, pengeluaran: 39000000 },
  { month: "Jun", pemasukan: 67000000, pengeluaran: 45000000 },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

export default function DashboardPage() {
  const totalIncome = mockTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = mockTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpense
  const cashBalance = totalIncome - totalExpense

  const expenseByCategory = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const existing = acc.find((item) => item.name === t.category)
        if (existing) {
          existing.value += t.amount
        } else {
          acc.push({ name: t.category, value: t.amount })
        }
        return acc
      },
      [] as Array<{ name: string; value: number }>,
    )

  const COLORS = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"]

  const recentTransactions = mockTransactions.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Ringkasan keuangan bisnis Anda</p>
          </div>
          <Link href="/dashboard/transactions">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </Button>
          </Link>
        </div>

        {/* Stats Cards - Improved Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Pemasukan"
            value={formatCurrency(totalIncome)}
            change={`${mockTransactions.filter((t) => t.type === "income").length} transaksi`}
            changeType="positive"
            icon={TrendingUp}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Total Pengeluaran"
            value={formatCurrency(totalExpense)}
            change={`${mockTransactions.filter((t) => t.type === "expense").length} transaksi`}
            changeType="negative"
            icon={TrendingDown}
            iconColor="bg-red-100 text-red-600"
          />
          <StatCard
            title="Laba Bersih"
            value={formatCurrency(netProfit)}
            change={netProfit >= 0 ? "Positif" : "Negatif"}
            changeType={netProfit >= 0 ? "positive" : "negative"}
            icon={DollarSign}
            iconColor="bg-green-100 text-green-600"
          />
          <StatCard
            title="Saldo Kas"
            value={formatCurrency(cashBalance)}
            change="Saldo saat ini"
            changeType="neutral"
            icon={Wallet}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        {/* Main Chart - Full Width */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="text-xl">Pemasukan vs Pengeluaran</CardTitle>
            <CardDescription>Tren 6 bulan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-sm" />
                <YAxis className="text-sm" tickFormatter={(value) => `${value / 1000000}jt`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                />
                <Legend />
                <Bar dataKey="pemasukan" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Pemasukan" />
                <Bar dataKey="pengeluaran" fill="#ef4444" radius={[8, 8, 0, 0]} name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supporting Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Profit Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Laba Bersih</CardTitle>
              <CardDescription>6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyData.map((item) => ({
                    month: item.month,
                    laba: item.pemasukan - item.pengeluaran,
                  }))}
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(value) => `${value / 1000000}jt`} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="laba"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: "#22c55e", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Rincian Pengeluaran</CardTitle>
              <CardDescription>Berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaksi Terbaru</CardTitle>
                <CardDescription>{recentTransactions.length} transaksi terakhir</CardDescription>
              </div>
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm">
                  Lihat Semua
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-2 ${transaction.type === "income" ? "bg-blue-100" : "bg-red-100"}`}>
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.type === "income" ? "text-blue-600" : "text-red-600"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
