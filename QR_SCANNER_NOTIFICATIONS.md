# QR Scanner Notifications Documentation

## 📋 Overview
Added comprehensive toast notifications to QR Scanner component to provide user feedback, matching the notification style used across other pages.

## ✅ Implemented Notifications

### 1. **Camera Started** (Info)
```typescript
toast.info("Camera Started", {
  description: "Point your camera at a QR code to scan"
});
```
- **Trigger:** When camera successfully starts
- **Type:** Info (blue)
- **Purpose:** Confirm camera is active and guide user

### 2. **QR Code Scanned** (Success)
```typescript
toast.success("QR Code Scanned!", {
  description: `Successfully decoded: ${data.substring(0, 50)}...`
});
```
- **Trigger:** When QR code successfully decoded
- **Type:** Success (green)
- **Purpose:** Confirm successful scan with preview of decoded data
- **Note:** Data truncated to 50 chars if longer

### 3. **Permission Denied** (Error)
```typescript
toast.error("Permission Denied", {
  description: "Camera access is required to scan QR codes"
});
```
- **Trigger:** User denies camera permission
- **Type:** Error (red)
- **Purpose:** Explain why camera won't start

### 4. **No Camera Found** (Error)
```typescript
toast.error("No Camera Found", {
  description: "Please connect a camera or use the upload option"
});
```
- **Trigger:** No camera device detected
- **Type:** Error (red)
- **Purpose:** Guide user to alternative (upload image)

### 5. **Camera Error** (Error)
```typescript
toast.error("Camera Error", {
  description: "Failed to access camera. Please check permissions."
});
```
- **Trigger:** Generic camera initialization error
- **Type:** Error (red)
- **Purpose:** Catch-all for unexpected camera errors

### 6. **Processing Image** (Info)
```typescript
toast.info("Processing image...", {
  description: "Scanning QR code from uploaded image"
});
```
- **Trigger:** User uploads an image file
- **Type:** Info (blue)
- **Purpose:** Indicate processing in progress

### 7. **QR Code Found in Image** (Success)
```typescript
toast.success("QR Code found!", {
  description: "Successfully extracted QR code from image"
});
```
- **Trigger:** QR code successfully decoded from uploaded image
- **Type:** Success (green)
- **Purpose:** Confirm successful image processing

### 8. **No QR Code in Image** (Error)
```typescript
toast.error("No QR code found", {
  description: "Please make sure the image contains a clear QR code"
});
```
- **Trigger:** No QR code detected in uploaded image
- **Type:** Error (red)
- **Purpose:** Guide user to upload better image

### 9. **Invalid File Type** (Error)
```typescript
toast.error("Invalid file type", {
  description: "Please select an image file (PNG, JPG, etc.)"
});
```
- **Trigger:** User uploads non-image file
- **Type:** Error (red)
- **Purpose:** Validate file type

### 10. **Copied to Clipboard** (Success)
```typescript
toast.success("Copied to clipboard");
```
- **Trigger:** User clicks "Copy" button on scan result
- **Type:** Success (green)
- **Purpose:** Confirm clipboard action

## 🎨 Notification Patterns

### Consistent Style
All notifications follow the same pattern as other pages:
- **Title:** Short, descriptive action (e.g., "QR Code Scanned!")
- **Description:** Detailed context or next steps
- **Type:** Matches action result (success/error/info)

### User Guidance
Notifications provide clear guidance:
- ✅ Success: Confirm action and show preview
- ❌ Error: Explain problem and suggest solution
- ℹ️ Info: Indicate status and guide next action

## 🧪 Testing Notifications

### Camera Scanning
1. Click "Start Camera" → See "Camera Started" notification
2. Scan QR code → See "QR Code Scanned!" with data preview
3. Deny permission → See "Permission Denied" error

### Image Upload
1. Click "Upload Image" → Select image → See "Processing image..."
2. Valid QR in image → See "QR Code found!"
3. Invalid image → See "No QR code found"
4. Non-image file → See "Invalid file type"

### Copy Action
1. After successful scan → Click "Copy" → See "Copied to clipboard"

## 📊 Notification Flow

```
┌─────────────────┐
│  Start Camera   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Success? │
    └─┬─────┬─┘
      │     │
   Yes│     │No
      │     │
┌─────▼─┐ ┌─▼──────────┐
│ Info  │ │   Error    │
│Toast  │ │   Toast    │
└───┬───┘ └────────────┘
    │
┌───▼──────┐
│ Scanning │
└────┬─────┘
     │
┌────▼────┐
│ QR Found?│
└─┬─────┬─┘
  │     │
Yes│    │No
  │     │
┌─▼─────▼──┐
│ Success  │
│  Toast   │
└──────────┘
```

## 🔧 Implementation Details

### Location
File: `components/qr-scanner.tsx`

### Dependencies
- `sonner` - Toast notification library
- Imported as: `import { toast } from "sonner";`

### Integration
Notifications integrated into:
- `handleStartScanning()` - Camera start flow
- `handleScanSuccess()` - Successful scan
- `handleFileUpload()` - Image upload flow
- Copy button onClick handler

## ✨ Benefits

1. **User Feedback:** Immediate visual confirmation of actions
2. **Error Guidance:** Clear instructions when issues occur
3. **Consistency:** Matches notification style across entire app
4. **Accessibility:** Visual feedback for all user actions
5. **Professional:** Polished UX matching modern web apps

## 📝 Notes

- All notifications auto-dismiss after 3-4 seconds (sonner default)
- Error notifications stay slightly longer for user to read
- Notifications stack if multiple triggered quickly
- Mobile-friendly positioning (bottom-right on desktop, bottom on mobile)
