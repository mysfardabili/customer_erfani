"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, Loader2, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ReceiptUploadProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExtractData: (data: any) => void
}

export function ReceiptUpload({ open, onOpenChange, onExtractData }: ReceiptUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState<"idle" | "reading" | "uploading" | "complete">("idle")

  const DEMO_DATA = {
    type: "expense",
    category: "Pembelian Bahan Baku",
    amount: "450000",
    description: "Bahan baku kualitas premium dari supplier",
    paymentMethod: "bank_transfer",
    date: new Date(),
    notes: "Pesanan untuk produksi minggu depan",
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true)
    } else if (e.type === "dragleave") {
      setIsDragActive(false)
    }
  }

  const processImage = async (file: File) => {
    setIsLoading(true)
    setError("")
    setProgress("reading")

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          setProgress("uploading")
          const base64Image = e.target?.result as string

          const response = await fetch("/api/extract-receipt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: base64Image }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            if (errorData.instructionsUrl) {
              setError(
                `${errorData.error} Buka https://console.groq.com untuk mendapatkan API key gratis, kemudian tambahkan ke environment variables sebagai GROQ_API_KEY.`,
              )
            } else {
              setError(errorData.error || "Gagal mengekstrak data struk")
            }
            setIsLoading(false)
            setProgress("idle")
            return
          }

          const extractedData = await response.json()
          console.log("[v0] Receipt extraction response:", extractedData)

          if (extractedData.error) {
            setError(extractedData.error)
            setIsLoading(false)
            setProgress("idle")
            return
          }

          if (extractedData.date && typeof extractedData.date === "string") {
            extractedData.date = new Date(extractedData.date)
          }

          console.log("[v0] Calling onExtractData with:", extractedData)
          setProgress("complete")
          onExtractData(extractedData)

          setTimeout(() => {
            onOpenChange(false)
            setIsLoading(false)
            setProgress("idle")
          }, 500)
        } catch (err) {
          console.log("[v0] Error in reader.onload:", err)
          setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses struk")
          setIsLoading(false)
          setProgress("idle")
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.log("[v0] Error in processImage:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memproses struk")
      setIsLoading(false)
      setProgress("idle")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        processImage(file)
      } else {
        setError("Silakan upload file gambar (JPG, PNG, dll)")
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      console.log("[v0] File selected:", files[0].name)
      processImage(files[0])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Struk (Enhanced AI)</DialogTitle>
          <DialogDescription>
            Upload foto struk atau invoice untuk mengisi data transaksi secara otomatis dengan AI
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Groq API:</strong> Dapatkan API key gratis dari{" "}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">
              console.groq.com
            </a>{" "}
            tanpa perlu credit card, kemudian setup di environment variables dengan key GROQ_API_KEY.
          </AlertDescription>
        </Alert>

        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium text-primary mb-1">
                  {progress === "reading" && "Membaca file..."}
                  {progress === "uploading" && "Mengunggah struk..."}
                  {progress === "complete" && "Selesai!"}
                </p>
                <p className="text-xs text-muted-foreground">Proses cepat, harap tunggu</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drag & drop struk di sini</p>
              <p className="text-xs text-muted-foreground mb-4">atau</p>
              <label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={isLoading}
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Pilih File</span>
                </Button>
              </label>
            </>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <p className="text-xs text-muted-foreground">Format: JPG, PNG. Ukuran maksimal: 5MB</p>
      </DialogContent>
    </Dialog>
  )
}
