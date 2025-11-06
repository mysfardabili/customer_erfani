"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DebtForm } from "@/components/debt-form"
import { PaymentForm } from "@/components/payment-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, MoreVertical, Edit, Trash2, DollarSign, Clock, CheckCircle2, AlertCircle } from "lucide-react"

// Sample data
const sampleDebts = [
  {
    id: 1,
    type: "receivable",
    contactName: "PT Maju Jaya",
    contactPhone: "081234567890",
    amount: 15000000,
    paidAmount: 5000000,
    description: "Penjualan barang dagangan",
    issueDate: "2024-12-15",
    dueDate: "2025-01-15",
    status: "partial",
    notes: "Pembayaran dicicil 3x",
    payments: [{ id: 1, amount: 5000000, paymentDate: "2024-12-20", notes: "Cicilan pertama" }],
  },
  {
    id: 2,
    type: "receivable",
    contactName: "CV Berkah Selalu",
    contactPhone: "082345678901",
    amount: 8000000,
    paidAmount: 8000000,
    description: "Jasa konsultasi",
    issueDate: "2024-12-10",
    dueDate: "2025-01-10",
    status: "paid",
    notes: "",
    payments: [{ id: 1, amount: 8000000, paymentDate: "2025-01-05", notes: "Lunas" }],
  },
  {
    id: 3,
    type: "receivable",
    contactName: "Toko Sejahtera",
    contactPhone: "083456789012",
    amount: 12000000,
    paidAmount: 0,
    description: "Penjualan produk retail",
    issueDate: "2025-01-01",
    dueDate: "2025-02-01",
    status: "unpaid",
    notes: "",
    payments: [],
  },
  {
    id: 4,
    type: "payable",
    contactName: "PT Supplier Utama",
    contactPhone: "084567890123",
    amount: 20000000,
    paidAmount: 10000000,
    description: "Pembelian bahan baku",
    issueDate: "2024-12-20",
    dueDate: "2025-01-20",
    status: "partial",
    notes: "Pembayaran bertahap",
    payments: [{ id: 1, amount: 10000000, paymentDate: "2024-12-25", notes: "DP 50%" }],
  },
  {
    id: 5,
    type: "payable",
    contactName: "CV Distributor Jaya",
    contactPhone: "085678901234",
    amount: 5000000,
    paidAmount: 0,
    description: "Pembelian perlengkapan",
    issueDate: "2025-01-03",
    dueDate: "2025-02-03",
    status: "overdue",
    notes: "Jatuh tempo sudah lewat",
    payments: [],
  },
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value)
}

const getStatusBadge = (status: string, dueDate: string) => {
  const today = new Date()
  const due = new Date(dueDate)
  const isOverdue = due < today

  if (status === "paid") {
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Lunas</Badge>
  }
  if (isOverdue && status !== "paid") {
    return <Badge variant="destructive">Jatuh Tempo</Badge>
  }
  if (status === "partial") {
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Sebagian</Badge>
  }
  return <Badge variant="secondary">Belum Dibayar</Badge>
}

export default function DebtsPage() {
  const [debts, setDebts] = useState(sampleDebts)
  const [formOpen, setFormOpen] = useState(false)
  const [paymentFormOpen, setPaymentFormOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<any>(null)
  const [selectedDebt, setSelectedDebt] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleAddDebt = (data: any) => {
    const newDebt = {
      id: debts.length + 1,
      ...data,
      amount: Number.parseFloat(data.amount),
      paidAmount: 0,
      issueDate: data.issueDate.toISOString().split("T")[0],
      dueDate: data.dueDate.toISOString().split("T")[0],
      status: "unpaid",
      payments: [],
    }
    setDebts([newDebt, ...debts])
  }

  const handleEditDebt = (data: any) => {
    setDebts(
      debts.map((d) =>
        d.id === editingDebt.id
          ? {
              ...d,
              ...data,
              amount: Number.parseFloat(data.amount),
              issueDate: data.issueDate.toISOString().split("T")[0],
              dueDate: data.dueDate.toISOString().split("T")[0],
            }
          : d,
      ),
    )
    setEditingDebt(null)
  }

  const handleAddPayment = (data: any) => {
    const paymentAmount = Number.parseFloat(data.amount)
    const newPaidAmount = selectedDebt.paidAmount + paymentAmount
    const newStatus = newPaidAmount >= selectedDebt.amount ? "paid" : "partial"

    const newPayment = {
      id: selectedDebt.payments.length + 1,
      amount: paymentAmount,
      paymentDate: data.paymentDate.toISOString().split("T")[0],
      notes: data.notes,
    }

    setDebts(
      debts.map((d) =>
        d.id === selectedDebt.id
          ? {
              ...d,
              paidAmount: newPaidAmount,
              status: newStatus,
              payments: [...d.payments, newPayment],
            }
          : d,
      ),
    )
    setSelectedDebt(null)
  }

  const handleDeleteDebt = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setDebts(debts.filter((d) => d.id !== id))
    }
  }

  const filteredDebts = debts.filter((d) => {
    const matchesSearch =
      d.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "receivable") return matchesSearch && d.type === "receivable"
    if (activeTab === "payable") return matchesSearch && d.type === "payable"
    return matchesSearch
  })

  const totalReceivable = debts
    .filter((d) => d.type === "receivable")
    .reduce((sum, d) => sum + (d.amount - d.paidAmount), 0)

  const totalPayable = debts.filter((d) => d.type === "payable").reduce((sum, d) => sum + (d.amount - d.paidAmount), 0)

  const overdueCount = debts.filter((d) => {
    const today = new Date()
    const due = new Date(d.dueDate)
    return due < today && d.status !== "paid"
  }).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Piutang & Hutang</h1>
            <p className="text-muted-foreground">Kelola piutang pelanggan dan hutang supplier</p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setEditingDebt(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" />
            Tambah Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Piutang</p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalReceivable)}</p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Hutang</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPayable)}</p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jatuh Tempo</p>
                  <p className="text-2xl font-bold text-orange-600">{overdueCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Item yang lewat jatuh tempo</p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <AlertCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Daftar Piutang & Hutang</CardTitle>
                <CardDescription>Semua data piutang dan hutang</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="receivable">Piutang</TabsTrigger>
                <TabsTrigger value="payable">Hutang</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Jatuh Tempo</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Terbayar</TableHead>
                        <TableHead className="text-right">Sisa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDebts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Tidak ada data ditemukan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDebts.map((debt) => (
                          <TableRow key={debt.id}>
                            <TableCell>
                              <Badge variant={debt.type === "receivable" ? "default" : "secondary"}>
                                {debt.type === "receivable" ? "Piutang" : "Hutang"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{debt.contactName}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{debt.description}</TableCell>
                            <TableCell>
                              {new Date(debt.dueDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(debt.amount)}</TableCell>
                            <TableCell className="text-right text-green-600">
                              {formatCurrency(debt.paidAmount)}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-red-600">
                              {formatCurrency(debt.amount - debt.paidAmount)}
                            </TableCell>
                            <TableCell>{getStatusBadge(debt.status, debt.dueDate)}</TableCell>
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
                                      setSelectedDebt(debt)
                                      setDetailDialogOpen(true)
                                    }}
                                  >
                                    <Clock className="mr-2 h-4 w-4" />
                                    Lihat Detail
                                  </DropdownMenuItem>
                                  {debt.status !== "paid" && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedDebt(debt)
                                        setPaymentFormOpen(true)
                                      }}
                                    >
                                      <CheckCircle2 className="mr-2 h-4 w-4" />
                                      Catat Pembayaran
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingDebt(debt)
                                      setFormOpen(true)
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteDebt(debt.id)}
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <DebtForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={editingDebt ? handleEditDebt : handleAddDebt}
        initialData={editingDebt}
      />

      {selectedDebt && (
        <>
          <PaymentForm
            open={paymentFormOpen}
            onOpenChange={setPaymentFormOpen}
            onSubmit={handleAddPayment}
            debtAmount={selectedDebt.amount}
            remainingAmount={selectedDebt.amount - selectedDebt.paidAmount}
          />

          <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detail {selectedDebt.type === "receivable" ? "Piutang" : "Hutang"}</DialogTitle>
                <DialogDescription>{selectedDebt.contactName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Deskripsi</p>
                    <p className="font-medium">{selectedDebt.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">No. Telepon</p>
                    <p className="font-medium">{selectedDebt.contactPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Transaksi</p>
                    <p className="font-medium">
                      {new Date(selectedDebt.issueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Jatuh Tempo</p>
                    <p className="font-medium">
                      {new Date(selectedDebt.dueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total:</span>
                    <span className="font-semibold">{formatCurrency(selectedDebt.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Terbayar:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(selectedDebt.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Sisa:</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(selectedDebt.amount - selectedDebt.paidAmount)}
                    </span>
                  </div>
                </div>

                {selectedDebt.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Catatan</p>
                    <p className="text-sm">{selectedDebt.notes}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">Riwayat Pembayaran</h4>
                  {selectedDebt.payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada pembayaran</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDebt.payments.map((payment: any) => (
                        <div key={payment.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium">{formatCurrency(payment.amount)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(payment.paymentDate).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                            {payment.notes && <p className="text-xs text-muted-foreground">{payment.notes}</p>}
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </DashboardLayout>
  )
}
