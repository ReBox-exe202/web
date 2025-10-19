"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Scanner } from "@yudiel/react-qr-scanner";
import jsQR from "jsqr";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RefreshCw, CheckCircle2, XCircle, ScanLine, Upload } from "lucide-react";
import { toast } from "sonner";

export default function QRScanner() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [detected, setDetected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    setResult("");
    setError("");
    setScanning(false);
    setDetected(false);
    setIsProcessing(false);
  };

  const handleStartScanning = () => {
    setError("");
    setResult("");
    setScanning(true);
  };

  const handleScanSuccess = (data: string) => {
    console.log("QR Code detected:", data);
    setResult(data);
    setDetected(true);
    setError("");
    setScanning(false);

    toast.success("QR Code Scanned!", {
      description: "Processing QR code data..."
    });

    if (data.includes('/package/')) {
      const match = data.match(/\/package\/([^/?#]+)/);
      if (match && match[1]) {
        const packageId = match[1];
        setTimeout(() => {
          router.push(`/package/${packageId}`);
        }, 500);
        return;
      }
    }

    setTimeout(() => setDetected(false), 1000);
  };

  const handleScanError = (error: unknown) => {
    console.error("QR Scanner error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to scan QR code";
    setError(errorMessage);
    toast.error("Scanner Error", {
      description: errorMessage
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (PNG, JPG, etc.)"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          toast.error("Failed to process image");
          setIsProcessing(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          handleScanSuccess(code.data);
        } else {
          toast.error("No QR code found", {
            description: "Please make sure the image contains a clear QR code"
          });
        }

        setIsProcessing(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.onerror = () => {
        toast.error("Failed to load image");
        setIsProcessing(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.src = imageUrl;
    } catch (err) {
      console.error("Error scanning file:", err);
      toast.error("No QR code found", {
        description: "Please make sure the image contains a clear QR code"
      });
      setIsProcessing(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground mt-1">Scan QR codes to track and manage items</p>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-center">
            {scanning && !result && !error && (
              <Badge variant="outline" className="gap-2">
                <ScanLine className="h-3 w-3 animate-pulse" />
                Scanning...
              </Badge>
            )}
            {detected && (
              <Badge className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="h-3 w-3" />
                Detected!
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="gap-2">
                <XCircle className="h-3 w-3" />
                Camera Error
              </Badge>
            )}
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden bg-muted">
              {!scanning && !error && !result && (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 gap-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <ScanLine className="w-16 h-16 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-2">Ready to Scan</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your camera to scan QR codes
                    </p>
                  </div>
                  <Button onClick={handleStartScanning} size="lg">
                    <ScanLine className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                </div>
              )}

              {scanning && !error && (
                <div className="relative w-full h-full">
                  <Scanner
                    onScan={(detectedCodes) => {
                      if (detectedCodes && detectedCodes.length > 0) {
                        const code = detectedCodes[0];
                        if (code.rawValue) {
                          handleScanSuccess(code.rawValue);
                        }
                      }
                    }}
                    onError={handleScanError}
                    constraints={{
                      facingMode: "environment",
                      aspectRatio: 1,
                    }}
                    components={{
                      onOff: false,
                      torch: true,
                      zoom: false,
                      finder: true,
                    }}
                    styles={{
                      container: {
                        width: "100%",
                        height: "100%",
                      },
                      video: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  />

                  {detected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
                      <div className="w-20 h-20 rounded-full bg-green-500/30 flex items-center justify-center animate-ping">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && !scanning && (
                <div className="w-full h-full flex flex-col items-center justify-center p-8">
                  <XCircle className="w-16 h-16 text-destructive mb-4" />
                  <p className="text-destructive text-center mb-4">{error}</p>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </div>

          {scanning && !result && !error && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Stop Camera
              </Button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border-t"></div>
              <span className="text-xs text-muted-foreground uppercase">Or</span>
              <div className="flex-1 border-t"></div>
            </div>

            <input
              ref={fileInputRef}
              id="qr-image-upload"
              aria-label="Upload QR code image"
              className="hidden"
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
            />

            <div className="flex justify-center">
              <Button
                variant="outline"
                className="max-w-xs"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing || scanning}
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-2">
              Select an image containing a QR code from your device
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="rounded-2xl shadow-sm border-green-500/50 animate-in slide-in-from-bottom">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">
                  Scan Successful!
                </h3>
                <p className="text-sm text-muted-foreground mb-3">QR Code Content:</p>
                <div className="bg-muted rounded-lg p-4 break-all font-mono text-sm">
                  {result}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                className="flex-1"
              >
                <ScanLine className="w-4 h-4 mr-2" />
                Scan Another
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  toast.success("Copied to clipboard");
                }}
              >
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
