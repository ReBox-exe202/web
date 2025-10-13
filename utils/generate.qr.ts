import axiosClient from "@/config/axios.config"

export interface GenerateQRRequest {
  itemUids: string[]
}

export interface QRCodeResult {
  itemUid: string
  qrCodeUrl: string
  status: "success" | "error"
  error?: string
}

export interface GenerateQRResponse {
  success: boolean
  message: string
  data: QRCodeResult[]
}

/**
 * Generate QR codes for multiple items
 */
export async function generateQRCodes(itemUids: string[]): Promise<GenerateQRResponse> {
  try {
    const response = await axiosClient.post<GenerateQRResponse>("/qr-codes/generate", {
      itemUids,
    })
    return response.data
  } catch (error: any) {
    console.error("Error generating QR codes:", error)
    throw new Error(error.response?.data?.message || "Failed to generate QR codes")
  }
}

/**
 * Download QR code as image
 */
export async function downloadQRCode(itemUid: string, qrCodeUrl: string): Promise<void> {
  try {
    const response = await fetch(qrCodeUrl)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `qr-code-${itemUid}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading QR code:", error)
    throw new Error("Failed to download QR code")
  }
}

/**
 * Download all QR codes as ZIP
 */
export async function downloadAllQRCodes(itemUids: string[]): Promise<void> {
  try {
    const response = await axiosClient.post(
      "/qr-codes/download-batch",
      { itemUids },
      { responseType: "blob" }
    )

    const blob = new Blob([response.data], { type: "application/zip" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `qr-codes-batch-${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error downloading QR codes batch:", error)
    throw new Error("Failed to download QR codes")
  }
}
