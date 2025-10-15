"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, Download, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface QRCode {
  itemId: string
  qrCodeUrl: string
  status: "success" | "error"
  error?: string
}

interface QRGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: string[]
  isLoading: boolean
  qrCodes: QRCode[]
  onDownloadAll?: () => void
  onDownloadSingle?: (itemId: string) => void
}

export function QRGenerationModal({
  open,
  onOpenChange,
  selectedItems,
  isLoading,
  qrCodes,
  onDownloadAll,
  onDownloadSingle,
}: QRGenerationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Generate QR Codes</DialogTitle>
          <DialogDescription>
            {isLoading
              ? `Generating QR codes for ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}...`
              : `Successfully generated ${qrCodes.filter(qr => qr.status === "success").length} QR code${qrCodes.length > 1 ? "s" : ""}`}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Generating QR Codes...</p>
              <p className="text-sm text-muted-foreground">
                Processing {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
              <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }} />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Action Buttons */}
            {qrCodes.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {qrCodes.filter(qr => qr.status === "success").length} of {qrCodes.length} successful
                </p>
                <Button onClick={onDownloadAll} size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            )}

            {/* QR Codes Grid */}
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {qrCodes.map((qrCode) => (
                  <Card key={qrCode.itemId} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={qrCode.status === "success" ? "default" : "destructive"}>
                        {qrCode.itemId}
                      </Badge>
                      {qrCode.status === "success" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onDownloadSingle?.(qrCode.itemId)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {qrCode.status === "success" ? (
                      <div className="relative aspect-square bg-white rounded-lg overflow-hidden border">
                        <Image
                          src={qrCode.qrCodeUrl}
                          alt={`QR Code for ${qrCode.itemId}`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-destructive/10 rounded-lg flex items-center justify-center">
                        <div className="text-center p-4">
                          <X className="h-8 w-8 text-destructive mx-auto mb-2" />
                          <p className="text-xs text-destructive">{qrCode.error || "Failed"}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
