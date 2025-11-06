"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Building2, Mail, Lock, User, Briefcase, AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessType: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Kata sandi tidak cocok")
      return
    }

    if (formData.password.length < 6) {
      setError("Kata sandi minimal 6 karakter")
      return
    }

    setIsLoading(true)

    // TODO: Implement Supabase registration
    setTimeout(() => {
      setIsLoading(false)
      // Temporary: redirect to dashboard
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-lg">
              <Building2 className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>Mulai kelola keuangan bisnis Anda hari ini</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="businessName">Nama Usaha</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Toko Maju Jaya"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Jenis Usaha</Label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis usaha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail/Toko</SelectItem>
                  <SelectItem value="fnb">Makanan & Minuman</SelectItem>
                  <SelectItem value="service">Jasa</SelectItem>
                  <SelectItem value="manufacturing">Manufaktur</SelectItem>
                  <SelectItem value="trading">Perdagangan</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Nama Pemilik</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Budi Santoso"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@perusahaan.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Daftar"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Masuk di sini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
