export interface QRCodeResult {
  itemId: string
  qrCodeUrl: string
  status: "success" | "error"
  error?: string
}

export interface GenerateQRResponse {
  success: boolean
  message: string
  data: QRCodeResult[]
}