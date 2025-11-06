"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TransactionForm } from "@/components/transaction-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, ArrowUpRight, ArrowDownRight, Download } from "lucide-react"
import { mockTransactions } from "@/lib/mock-data"
import { exportTransactionsToPDF } from "@/lib/pdf-export"

// Sample data - will be replaced with real data from Supabase
const sampleTransactions = [
  {
    id: 1,
    type: "income",
    category: "Penjualan Produk",
    description: "Penjualan 15 unit Produk A",
    amount: 3750000,
    date: "2025-01-06",
    paymentMethod: "bank_transfer",
    notes: "Pembayaran dari PT ABC",
  },
  {
    id: 2,
    type: "expense",
    category: "Pembelian Bahan Baku",
    description: "Pembelian bahan baku untuk produksi",
    amount: 2500000,
    date: "2025-01-05",
    paymentMethod: "cash",
    notes: "",
  },
  {
    id: 3,
    type: "income",
    category: "Penjualan Jasa",
    description: "Jasa konsultasi bisnis",
    amount: 5000000,
    date: "2025-01-05",
    paymentMethod: "bank_transfer",
    notes: "Klien: CV XYZ",
  },
  {
    id: 4,
    type: "expense",
    category: "Gaji Karyawan",
    description: "Gaji bulan Januari 2025",
    amount: 8000000,
    date: "2025-01-04",
    paymentMethod: "bank_transfer",
    notes: "5 karyawan",
  },
  {
    id: 5,
    type: "expense",
    category: "Sewa Tempat",
    description: "Sewa toko bulan Januari",
    amount: 3000000,
    date: "2025-01-03",
    paymentMethod: "bank_transfer",
    notes: "",
  },
  {
    id: 6,
    type: "income",
    category: "Penjualan Produk",
    description: "Penjualan 8 unit Produk B",
    amount: 4800000,
    date: "2025-01-03",
    paymentMethod: "e_wallet",
    notes: "",
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

const paymentMethodLabels: Record<string, string> = {
  cash: "Tunai",
  bank_transfer: "Transfer Bank",
  debit_card: "Kartu Debit",
  credit_card: "Kartu Kredit",
  e_wallet: "E-Wallet",
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")

  const handleAddTransaction = (data: any) => {
    const newTransaction = {
      id: transactions.length + 1,
      ...data,
      amount: Number.parseFloat(data.amount),
      date: data.date.toISOString().split("T")[0],
    }
    setTransactions([newTransaction, ...transactions])
  }

  const handleEditTransaction = (data: any) => {
    setTransactions(
      transactions.map((t) =>
        t.id === editingTransaction.id
          ? {
              ...t,
              ...data,
              amount: Number.parseFloat(data.amount),
              date: data.date.toISOString().split("T")[0],
            }
          : t,
      ),
    )
    setEditingTransaction(null)
  }

  const handleDeleteTransaction = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions(transactions.filter((t) => t.id !== id))
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || t.type === filterType
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const handleExportTransactions = async () => {
    await exportTransactionsToPDF(filteredTransactions, new Date().getFullYear().toString())
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
            <p className="text-muted-foreground">Kelola semua transaksi pemasukan dan pengeluaran</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExportTransactions}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingTransaction(null)
                setFormOpen(true)
              }}
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pemasukan</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <ArrowUpRight className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <ArrowDownRight className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Selisih</p>
                  <p
                    className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(totalIncome - totalExpense)}
                  </p>
                </div>
                <div className={`rounded-full p-3 ${totalIncome - totalExpense >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <ArrowUpRight
                    className={`h-6 w-6 ${totalIncome - totalExpense >= 0 ? "text-green-600" : "text-red-600"}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
            <CardDescription>Semua transaksi yang telah dicatat</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Transaksi</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead className="text-right">Jumlah</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Tidak ada transaksi ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {new Date(transaction.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === "income" ? "default" : "destructive"}>
                            {transaction.type === "income" ? "Pemasukan" : "Pengeluaran"}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell>{paymentMethodLabels[transaction.paymentMethod]}</TableCell>
                        <TableCell
                          className={`text-right font-semibold ${transaction.type === "income" ? "text-blue-600" : "text-red-600"}`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingTransaction(transaction)
                                  setFormOpen(true)
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
        initialData={editingTransaction}
      />
    </DashboardLayout>
  )
}
