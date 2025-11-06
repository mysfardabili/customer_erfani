"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, Camera, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface QRScannerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onScan: (data: any) => void
}

export function QRScanner({ open, onOpenChange, onScan }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string>("")
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (!open) return

    const startCamera = async () => {
      try {
        setError("")
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsScanning(true)
          scanQRCode()
        }
      } catch (err) {
        setError("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.")
        setIsScanning(false)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [open])

  const scanQRCode = () => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = decodeQRCode(imageData)

          if (code) {
            try {
              const data = JSON.parse(code)
              onScan(data)
              onOpenChange(false)
            } catch {
              setError("Format QR code tidak valid. Pastikan QR code berisi data JSON transaksi.")
            }
          }
        } catch (err) {
          // Continue scanning
        }
      }

      if (isScanning) {
        requestAnimationFrame(scan)
      }
    }

    scan()
  }

  const decodeQRCode = (imageData: ImageData): string | null => {
    // Simple QR code detection - in production, use a library like jsQR
    // This is a placeholder that looks for QR code patterns
    const data = imageData.data
    let qrData = ""

    // For demo purposes, we'll use a simple pattern detection
    // In production, integrate jsQR or similar library
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] < 128) {
        qrData += "1"
      } else {
        qrData += "0"
      }
    }

    // This is simplified - real QR decoding is complex
    return null
  }

  const handleClose = () => {
    setIsScanning(false)
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Scan QR Code Transaksi
          </DialogTitle>
          <DialogDescription>Arahkan kamera ke QR code untuk memindai data transaksi</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* QR Scanner Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-green-500 rounded-lg relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Pastikan QR code berada dalam bingkai hijau untuk hasil terbaik
          </p>

          <Button variant="outline" className="w-full bg-transparent" onClick={handleClose}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
