/**
 * Mock QR Code Generation for Testing
 * This simulates backend API responses for QR generation
 */

import { GenerateQRResponse, QRCodeResult } from "@/types/qr.types"
import QRCode from "qrcode"

/**
 * Generate a QR code as data URL (base64 PNG)
 */
async function generateQRCodeDataURL(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    throw error
  }
}

/**
 * Mock function to simulate QR code generation API call
 * Simulates network delay and returns QR codes as base64 images
 */
export async function mockGenerateQRCodes(itemIds: string[]): Promise<GenerateQRResponse> {
  // Simulate network delay (1-3 seconds)
  const delay = 1000 + Math.random() * 2000
  await new Promise((resolve) => setTimeout(resolve, delay))

  // Generate QR codes for each item
  const results: QRCodeResult[] = []

  for (const itemId of itemIds) {
    try {
      // Simulate 10% failure rate for testing error handling
      const shouldFail = Math.random() < 0.1

      if (shouldFail) {
        results.push({
          itemId,
          qrCodeUrl: "",
          status: "error",
          error: "Failed to generate QR code",
        })
      } else {
        // Generate QR code containing package URL
        const qrData = `${window.location.origin}/package/${itemId}`

        const qrCodeUrl = await generateQRCodeDataURL(qrData)

        results.push({
          itemId,
          qrCodeUrl,
          status: "success",
        })
      }
    } catch (error) {
      results.push({
        itemId,
        qrCodeUrl: "",
        status: "error",
        error: "QR generation failed",
      })
    }
  }

  const successCount = results.filter((r) => r.status === "success").length

  return {
    success: successCount > 0,
    message:
      successCount === results.length
        ? "All QR codes generated successfully"
        : `Generated ${successCount} of ${results.length} QR codes`,
    data: results,
  }
}

/**
 * Mock function to generate QR code for single item (for testing)
 */
export async function mockGenerateSingleQR(itemId: string): Promise<string> {
  const qrData = `${window.location.origin}/package/${itemId}`

  return await generateQRCodeDataURL(qrData)
}

/**
 * Test scenarios for QR generation
 */
export const QR_TEST_SCENARIOS = {
  // All successful
  allSuccess: ["PKG-001", "PKG-002", "PKG-003"],

  // All fail
  allFail: ["INVALID-001", "INVALID-002", "INVALID-003"],

  // Mixed success/fail
  mixed: ["PKG-001", "INVALID-001", "PKG-002", "INVALID-002"],

  // Large batch
  largeBatch: Array.from({ length: 20 }, (_, i) => `PKG-${String(i + 1).padStart(3, "0")}`),

  // Single item
  single: ["PKG-001"],
}

/**
 * Mock download functions for testing
 */
export async function mockDownloadQRCode(itemId: string, qrCodeUrl: string): Promise<void> {
  // Create a link and trigger download
  const link = document.createElement("a")
  link.href = qrCodeUrl
  link.download = `qr-code-${itemId}.png`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export async function mockDownloadAllQRCodes(qrCodes: QRCodeResult[]): Promise<void> {
  // In a real implementation, this would create a ZIP file
  // For mock, we'll download each individually with a delay
  for (const qr of qrCodes) {
    if (qr.status === "success" && qr.qrCodeUrl) {
      await mockDownloadQRCode(qr.itemId, qr.qrCodeUrl)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
}
