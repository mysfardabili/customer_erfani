import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export async function exportReportToPDF(reportType: string, period: string) {
  try {
    let element = document.getElementById(`${reportType}-report`)

    // Fallback for different ID patterns
    if (!element) {
      if (reportType === "income-statement") {
        element = document.getElementById("income-statement-report")
      } else if (reportType === "cash-flow") {
        element = document.getElementById("cash-flow-report")
      } else if (reportType === "tax") {
        element = document.getElementById("tax-report")
      }
    }

    if (!element) {
      throw new Error(`Laporan ${reportType} tidak ditemukan`)
    }

    // Make element visible temporarily if it's hidden
    const originalDisplay = element.style.display
    element.style.display = "block"

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    // Restore original display
    element.style.display = originalDisplay

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= 297

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    const fileName = `Laporan-${reportType}-${period}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error("Error exporting PDF:", error instanceof Error ? error.message : error)
    alert("Gagal mengekspor laporan ke PDF: " + (error instanceof Error ? error.message : "Unknown error"))
  }
}

export async function exportTransactionsToPDF(transactions: any[], period: string) {
  try {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    pdf.setFontSize(16)
    pdf.text("Laporan Daftar Transaksi", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 10
    pdf.setFontSize(10)
    pdf.text(`Periode: ${period}`, pageWidth / 2, yPosition, { align: "center" })

    yPosition += 15

    const columns = ["Tanggal", "Jenis", "Kategori", "Deskripsi", "Metode", "Jumlah"]
    const columnWidths = [25, 20, 30, 50, 25, 35]

    pdf.setFontSize(9)
    pdf.setFont(undefined, "bold")

    let xPosition = 10
    columns.forEach((col, index) => {
      pdf.text(col, xPosition, yPosition)
      xPosition += columnWidths[index]
    })

    yPosition += 7
    pdf.setDrawColor(200)
    pdf.line(10, yPosition, pageWidth - 10, yPosition)

    yPosition += 5
    pdf.setFont(undefined, "normal")

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(value)
    }

    transactions.forEach((transaction) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage()
        yPosition = 20
      }

      xPosition = 10
      const date = new Date(transaction.date).toLocaleDateString("id-ID")
      const type = transaction.type === "income" ? "Pemasukan" : "Pengeluaran"
      const amount = `${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`

      pdf.text(date, xPosition, yPosition)
      xPosition += columnWidths[0]

      pdf.text(type, xPosition, yPosition)
      xPosition += columnWidths[1]

      pdf.text(transaction.category, xPosition, yPosition)
      xPosition += columnWidths[2]

      const desc = transaction.description.substring(0, 20)
      pdf.text(desc, xPosition, yPosition)
      xPosition += columnWidths[3]

      pdf.text(transaction.paymentMethod, xPosition, yPosition)
      xPosition += columnWidths[4]

      pdf.text(amount, xPosition, yPosition, { align: "right" })

      yPosition += 7
    })

    const fileName = `Transaksi-${period}.pdf`
    pdf.save(fileName)
  } catch (error) {
    console.error("Error exporting transactions:", error instanceof Error ? error.message : error)
    alert("Gagal mengekspor transaksi ke PDF")
  }
}
