"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { ReceiptUpload } from "./receipt-upload"

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
}

export function TransactionForm({ open, onOpenChange, onSubmit, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "income",
    category: initialData?.category || "",
    amount: initialData?.amount || "",
    description: initialData?.description || "",
    date: initialData?.date ? new Date(initialData.date) : new Date(),
    paymentMethod: initialData?.paymentMethod || "cash",
    notes: initialData?.notes || "",
  })

  const [receiptUploadOpen, setReceiptUploadOpen] = useState(false)

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          type: initialData.type || "income",
          category: initialData.category || "",
          amount: String(initialData.amount || ""),
          description: initialData.description || "",
          date: initialData.date ? new Date(initialData.date) : new Date(),
          paymentMethod: initialData.paymentMethod || "cash",
          notes: initialData.notes || "",
        })
      } else {
        setFormData({
          type: "income",
          category: "",
          amount: "",
          description: "",
          date: new Date(),
          paymentMethod: "cash",
          notes: "",
        })
      }
    }
  }, [open, initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleExtractReceipt = (extractedData: any) => {
    console.log("[v0] Extracted receipt data:", extractedData)

    const newFormData = {
      type: extractedData.type || "expense",
      category: extractedData.category || "",
      amount: String(extractedData.amount || "0"),
      description: extractedData.description || "",
      paymentMethod: extractedData.paymentMethod || "cash",
      notes: extractedData.notes || "",
      date: extractedData.date ? new Date(extractedData.date) : new Date(),
    }

    console.log("[v0] New form data object:", newFormData)
    setFormData({ ...newFormData })
    console.log("[v0] Form state updated, receipt dialog will close")
    setReceiptUploadOpen(false)
  }

  const incomeCategories = ["Penjualan Produk", "Penjualan Jasa", "Pendapatan Lain"]

  const expenseCategories = [
    "Pembelian Bahan Baku",
    "Gaji Karyawan",
    "Sewa Tempat",
    "Utilitas (Listrik, Air)",
    "Transportasi",
    "Marketing & Promosi",
    "Perlengkapan Kantor",
    "Pemeliharaan & Perbaikan",
    "Pajak & Administrasi",
    "Pengeluaran Lain",
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit Transaksi" : "Tambah Transaksi Baru"}</DialogTitle>
            <DialogDescription>
              {initialData ? "Ubah detail transaksi" : "Catat transaksi pemasukan atau pengeluaran"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 flex-1 bg-transparent"
                  onClick={() => setReceiptUploadOpen(true)}
                >
                  <Upload className="h-4 w-4" />
                  Upload Struk (Enhanced AI)
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Jenis Transaksi</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      console.log("[v0] Type changed to:", value)
                      setFormData({ ...formData, type: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Pemasukan</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => {
                      console.log("[v0] Category changed to:", value)
                      setFormData({ ...formData, category: value })
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Jumlah (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => {
                      console.log("[v0] Amount changed to:", e.target.value)
                      setFormData({ ...formData, amount: e.target.value })
                    }}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Tanggal</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP", { locale: id }) : "Pilih tanggal"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => {
                          if (date) {
                            console.log("[v0] Date changed to:", date)
                            setFormData({ ...formData, date })
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => {
                    console.log("[v0] Payment method changed to:", value)
                    setFormData({ ...formData, paymentMethod: value })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tunai</SelectItem>
                    <SelectItem value="bank_transfer">Transfer Bank</SelectItem>
                    <SelectItem value="debit_card">Kartu Debit</SelectItem>
                    <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input
                  id="description"
                  placeholder="Contoh: Penjualan 10 unit Produk A"
                  value={formData.description}
                  onChange={(e) => {
                    console.log("[v0] Description changed to:", e.target.value)
                    setFormData({ ...formData, description: e.target.value })
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Tambahkan catatan tambahan..."
                  value={formData.notes}
                  onChange={(e) => {
                    console.log("[v0] Notes changed to:", e.target.value)
                    setFormData({ ...formData, notes: e.target.value })
                  }}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit">{initialData ? "Simpan Perubahan" : "Tambah Transaksi"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ReceiptUpload
        open={receiptUploadOpen}
        onOpenChange={setReceiptUploadOpen}
        onExtractData={handleExtractReceipt}
      />
    </>
  )
}
