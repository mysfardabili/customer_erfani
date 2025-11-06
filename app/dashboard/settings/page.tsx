"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, User, Bell, Shield, Upload, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("/placeholder.svg?height=96&width=96")
  const [isSaving, setIsSaving] = useState(false)

  const [businessProfile, setBusinessProfile] = useState({
    businessName: "Toko Berkah Jaya",
    businessType: "retail",
    ownerName: "Budi Santoso",
    email: "budi@tokoberkah.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 123, Jakarta Pusat",
    npwp: "12.345.678.9-012.000",
    taxType: "pph-final",
    description: "Toko retail yang menjual berbagai kebutuhan sehari-hari",
  })

  const [userSettings, setUserSettings] = useState({
    language: "id",
    currency: "IDR",
    dateFormat: "dd/MM/yyyy",
    fiscalYearStart: "january",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    transactionAlerts: true,
    debtReminders: true,
    reportSummary: false,
    taxReminders: true,
  })

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
  })

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 2MB",
          variant: "destructive",
        })
        return
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast({
          title: "Format File Tidak Didukung",
          description: "Hanya format JPG dan PNG yang didukung",
          variant: "destructive",
        })
        return
      }

      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveBusinessProfile = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Profil Bisnis Disimpan",
        description: "Informasi bisnis Anda telah berhasil diperbarui.",
      })
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan profil bisnis",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveUserSettings = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Pengaturan Disimpan",
        description: "Preferensi Anda telah berhasil diperbarui.",
      })
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notifikasi Disimpan",
        description: "Pengaturan notifikasi Anda telah berhasil diperbarui.",
      })
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan notifikasi",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSecurity = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Keamanan Disimpan",
        description: "Pengaturan keamanan Anda telah berhasil diperbarui.",
      })
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan pengaturan keamanan",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
          <p className="text-muted-foreground">Kelola profil bisnis dan preferensi aplikasi Anda</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="business" className="space-y-4">
          <TabsList>
            <TabsTrigger value="business" className="gap-2">
              <Building2 className="h-4 w-4" />
              Profil Bisnis
            </TabsTrigger>
            <TabsTrigger value="user" className="gap-2">
              <User className="h-4 w-4" />
              Akun Pengguna
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Keamanan
            </TabsTrigger>
          </TabsList>

          {/* Business Profile Tab */}
          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Bisnis</CardTitle>
                <CardDescription>Kelola informasi dasar bisnis Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={logoPreview || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">TB</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/jpeg,image/png"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={() => document.getElementById("logo-upload")?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground">Format: JPG, PNG. Maksimal 2MB</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nama Bisnis *</Label>
                    <Input
                      id="businessName"
                      value={businessProfile.businessName}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, businessName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Jenis Bisnis *</Label>
                    <Select
                      value={businessProfile.businessType}
                      onValueChange={(value) => setBusinessProfile({ ...businessProfile, businessType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail / Toko</SelectItem>
                        <SelectItem value="wholesale">Grosir</SelectItem>
                        <SelectItem value="service">Jasa</SelectItem>
                        <SelectItem value="manufacturing">Manufaktur</SelectItem>
                        <SelectItem value="fnb">Food & Beverage</SelectItem>
                        <SelectItem value="other">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nama Pemilik *</Label>
                    <Input
                      id="ownerName"
                      value={businessProfile.ownerName}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, ownerName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={businessProfile.email}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">No. Telepon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={businessProfile.phone}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, phone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="npwp">NPWP</Label>
                    <Input
                      id="npwp"
                      placeholder="00.000.000.0-000.000"
                      value={businessProfile.npwp}
                      onChange={(e) => setBusinessProfile({ ...businessProfile, npwp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Lengkap *</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    value={businessProfile.address}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Bisnis</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Ceritakan tentang bisnis Anda..."
                    value={businessProfile.description}
                    onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxType">Jenis Pajak</Label>
                  <Select
                    value={businessProfile.taxType}
                    onValueChange={(value) => setBusinessProfile({ ...businessProfile, taxType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pph-final">PPh Final UMKM (0.5%)</SelectItem>
                      <SelectItem value="pph-umum">PPh Umum</SelectItem>
                      <SelectItem value="non-pkp">Non PKP</SelectItem>
                      <SelectItem value="pkp">PKP (PPN)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Pilih jenis pajak yang sesuai dengan status bisnis Anda
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveBusinessProfile} className="gap-2" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Settings Tab */}
          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Aplikasi</CardTitle>
                <CardDescription>Sesuaikan tampilan dan format aplikasi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Bahasa</Label>
                    <Select
                      value={userSettings.language}
                      onValueChange={(value) => setUserSettings({ ...userSettings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Mata Uang</Label>
                    <Select
                      value={userSettings.currency}
                      onValueChange={(value) => setUserSettings({ ...userSettings, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR (Rupiah)</SelectItem>
                        <SelectItem value="USD">USD (Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Format Tanggal</Label>
                    <Select
                      value={userSettings.dateFormat}
                      onValueChange={(value) => setUserSettings({ ...userSettings, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiscalYear">Awal Tahun Fiskal</Label>
                    <Select
                      value={userSettings.fiscalYearStart}
                      onValueChange={(value) => setUserSettings({ ...userSettings, fiscalYearStart: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="january">Januari</SelectItem>
                        <SelectItem value="april">April</SelectItem>
                        <SelectItem value="july">Juli</SelectItem>
                        <SelectItem value="october">Oktober</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveUserSettings} className="gap-2" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
                <CardDescription>Perbarui password akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input id="currentPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Ubah Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Notifikasi</CardTitle>
                <CardDescription>Kelola notifikasi yang Anda terima</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notifikasi Email</Label>
                      <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="transactionAlerts">Notifikasi Transaksi</Label>
                      <p className="text-sm text-muted-foreground">
                        Dapatkan pemberitahuan untuk setiap transaksi baru
                      </p>
                    </div>
                    <Switch
                      id="transactionAlerts"
                      checked={notifications.transactionAlerts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, transactionAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="debtReminders">Pengingat Piutang/Hutang</Label>
                      <p className="text-sm text-muted-foreground">
                        Ingatkan saya tentang piutang dan hutang yang jatuh tempo
                      </p>
                    </div>
                    <Switch
                      id="debtReminders"
                      checked={notifications.debtReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, debtReminders: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reportSummary">Ringkasan Laporan Bulanan</Label>
                      <p className="text-sm text-muted-foreground">Terima ringkasan laporan keuangan setiap bulan</p>
                    </div>
                    <Switch
                      id="reportSummary"
                      checked={notifications.reportSummary}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, reportSummary: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="taxReminders">Pengingat Pajak</Label>
                      <p className="text-sm text-muted-foreground">
                        Ingatkan saya tentang kewajiban pajak yang akan datang
                      </p>
                    </div>
                    <Switch
                      id="taxReminders"
                      checked={notifications.taxReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, taxReminders: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications} className="gap-2" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Keamanan Akun</CardTitle>
                <CardDescription>Kelola pengaturan keamanan akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="twoFactorAuth">Autentikasi Dua Faktor</Label>
                      <p className="text-sm text-muted-foreground">Tambahkan lapisan keamanan ekstra untuk akun Anda</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactorAuth: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout Sesi (menit)</Label>
                    <Select
                      value={security.sessionTimeout}
                      onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 menit</SelectItem>
                        <SelectItem value="30">30 menit</SelectItem>
                        <SelectItem value="60">1 jam</SelectItem>
                        <SelectItem value="120">2 jam</SelectItem>
                        <SelectItem value="never">Tidak pernah</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Otomatis keluar setelah tidak ada aktivitas dalam waktu yang ditentukan
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity} className="gap-2" disabled={isSaving}>
                    <Save className="h-4 w-4" />
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sesi Aktif</CardTitle>
                <CardDescription>Kelola perangkat yang terhubung ke akun Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Chrome di Windows</p>
                      <p className="text-sm text-muted-foreground">Jakarta, Indonesia • Aktif sekarang</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Keluar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Safari di iPhone</p>
                      <p className="text-sm text-muted-foreground">Jakarta, Indonesia • 2 jam yang lalu</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Keluar
                    </Button>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="destructive" className="w-full">
                    Keluar dari Semua Perangkat
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
