"use client";

import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RefreshCw, CheckCircle2, XCircle, ScanLine, Info, Upload } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";

export default function QRScanner() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [scanning, setScanning] = useState<boolean>(false);
  const [detected, setDetected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  const stopScanning = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleReset = () => {
    stopScanning();
    
    setResult("");
    setError("");
    setScanning(false);
    setDetected(false);
    setIsProcessing(false);
    setCameraPermission("prompt");
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Try to decode QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      handleScanSuccess(code.data);
      return;
    }

    // Continue scanning
    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleStartScanning = async () => {
    setError("");
    setScanning(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Start scanning loop
        scanQRCode();
        setCameraPermission("granted");
        
        // Show scanning started notification
        toast.info("Camera Started", {
          description: "Point your camera at a QR code to scan"
        });
      }
    } catch (err: any) {
      console.error("Error starting scanner:", err);
      const errorMessage = err?.message || "";
      
      if (err?.name === "NotAllowedError" || errorMessage.includes("Permission")) {
        setError("Camera permission denied. Please allow access and try again.");
        setCameraPermission("denied");
        toast.error("Permission Denied", {
          description: "Camera access is required to scan QR codes"
        });
      } else if (err?.name === "NotFoundError" || errorMessage.includes("No camera")) {
        setError("No camera found. Please use the upload option instead.");
        toast.error("No Camera Found", {
          description: "Please connect a camera or use the upload option"
        });
      } else {
        setError("Failed to start camera. Please try again or use upload option.");
        toast.error("Camera Error", {
          description: "Failed to access camera. Please check permissions."
        });
      }
      
      setScanning(false);
    }
  };

  const handleScanSuccess = (data: string) => {
    setResult(data);
    setDetected(true);
    setError("");
    
    // Show success notification
    toast.success("QR Code Scanned!", {
      description: `Successfully decoded: ${data.length > 50 ? data.substring(0, 50) + "..." : data}`
    });
    
    setTimeout(() => setDetected(false), 1000);
    
    stopScanning();
    setScanning(false);
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
    toast.info("Processing image...", {
      description: "Scanning QR code from uploaded image"
    });

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
          setResult(code.data);
          setDetected(true);
          setScanning(false);
          toast.success("QR Code found!", {
            description: "Successfully extracted QR code from image"
          });
          setTimeout(() => setDetected(false), 1000);
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

      {!scanning && !result && cameraPermission === "prompt" && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Click "Start Camera" to begin scanning QR codes, or upload an image from your device.
          </AlertDescription>
        </Alert>
      )}

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
                QR Code Detected!
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
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Scanning Frame Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`relative w-64 h-64 transition-all duration-300 ${
                      detected ? "scale-105" : "scale-100"
                    }`}>
                      <div className={`absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 rounded-tl-2xl transition-colors duration-300 ${
                        detected ? "border-green-500" : "border-primary"
                      }`} />
                      
                      <div className={`absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 rounded-tr-2xl transition-colors duration-300 ${
                        detected ? "border-green-500" : "border-primary"
                      }`} />
                      
                      <div className={`absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 rounded-bl-2xl transition-colors duration-300 ${
                        detected ? "border-green-500" : "border-primary"
                      }`} />
                      
                      <div className={`absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 rounded-br-2xl transition-colors duration-300 ${
                        detected ? "border-green-500" : "border-primary"
                      }`} />

                      {!detected && (
                        <div className="absolute inset-0 overflow-hidden">
                          <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                        </div>
                      )}

                      {detected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-ping">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
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
            <p className="text-center text-muted-foreground text-sm mt-4">
              Position the QR code inside the frame
            </p>
          )}

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 border-t"></div>
              <span className="text-xs text-muted-foreground uppercase">Or</span>
              <div className="flex-1 border-t"></div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-image-upload"
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
