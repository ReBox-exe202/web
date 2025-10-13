# Mock QR Generation Testing Guide

## Overview
This guide explains how to test the QR generation feature using mock data before the backend API is implemented.

## File Structure
```
lib/
  mock-qr-generation.ts     # Mock API functions
app/(dashboard)/inventory/
  page.tsx                  # Updated to use mock API
```

## Mock Functions

### 1. `mockGenerateQRCodes(itemUids: string[])`
Simulates the QR generation API endpoint.

**Features:**
- 1-3 second random delay to simulate network latency
- Generates actual QR codes using the `qrcode` library
- QR codes contain JSON data with item UID, type, timestamp
- 10% random failure rate to test error handling
- Returns base64 PNG images (data URLs)

**Usage:**
```typescript
const response = await mockGenerateQRCodes(["PKG-001", "PKG-002", "PKG-003"])
// Returns: { success: true, message: "...", data: QRCodeResult[] }
```

### 2. `mockDownloadQRCode(itemUid, qrCodeUrl)`
Downloads a single QR code as PNG file.

**Features:**
- Creates download link dynamically
- Filename format: `qr-code-{itemUid}.png`
- Triggers browser download

### 3. `mockDownloadAllQRCodes(qrCodes)`
Downloads all QR codes sequentially.

**Features:**
- Filters out failed QR codes
- Downloads each with 500ms delay
- Real implementation would create ZIP file

## Test Scenarios

### Pre-defined Test Scenarios
```typescript
import { QR_TEST_SCENARIOS } from "@/lib/mock-qr-generation"

// All successful
QR_TEST_SCENARIOS.allSuccess    // ["PKG-001", "PKG-002", "PKG-003"]

// All fail
QR_TEST_SCENARIOS.allFail       // ["INVALID-001", "INVALID-002", "INVALID-003"]

// Mixed success/fail
QR_TEST_SCENARIOS.mixed         // ["PKG-001", "INVALID-001", "PKG-002", "INVALID-002"]

// Large batch (20 items)
QR_TEST_SCENARIOS.largeBatch    // ["PKG-001", "PKG-002", ..., "PKG-020"]

// Single item
QR_TEST_SCENARIOS.single        // ["PKG-001"]
```

## Testing Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Inventory Page
```
http://localhost:3000/inventory
```

### 3. Test QR Generation

#### Test Case 1: Basic Generation
1. Select 3-5 items from the table
2. Click "Generate QR (X)" button
3. **Expected:**
   - Modal opens immediately
   - Loading spinner appears for 1-3 seconds
   - QR codes display in grid layout
   - ~90% success rate (10% may show errors)
   - Success toast shows count

#### Test Case 2: Single Item
1. Select only 1 item
2. Click "Generate QR (1)"
3. **Expected:**
   - Same flow as above
   - 1 QR code displayed
   - Modal shows single item layout

#### Test Case 3: Large Batch
1. Select 10-20 items
2. Click "Generate QR (X)"
3. **Expected:**
   - Longer loading time
   - Grid layout with 2-3 columns
   - Scrollable area for many QR codes
   - Download All button available

#### Test Case 4: Download Single
1. Generate QR codes for multiple items
2. Click download icon on a specific QR code
3. **Expected:**
   - PNG file downloads immediately
   - Filename: `qr-code-{itemUid}.png`
   - 300x300px QR code image
   - Success toast notification

#### Test Case 5: Download All
1. Generate QR codes for multiple items
2. Click "Download All QR Codes" button
3. **Expected:**
   - Multiple PNGs download sequentially (500ms delay each)
   - Success toast notification
   - *Note: Real API will provide ZIP file*

#### Test Case 6: Error Handling
1. Generate QR codes for ~10 items
2. **Expected:**
   - ~1 item may show error (10% failure rate)
   - Error icon (X) displays for failed items
   - Error message shows below icon
   - Successful items still downloadable
   - Toast shows partial success count

#### Test Case 7: No Selection
1. Click "Generate QR" without selecting items
2. **Expected:**
   - Button is disabled
   - No modal opens

#### Test Case 8: Modal Interactions
1. Generate QR codes
2. Try scrolling when many codes
3. Close modal and reopen
4. **Expected:**
   - Smooth scrolling in modal
   - QR codes persist when reopening
   - Modal closes with X or outside click

## QR Code Content

Each generated QR code contains JSON data:
```json
{
  "itemUid": "PKG-001",
  "type": "reusable-packaging",
  "generatedAt": "2025-10-12T10:30:00.000Z",
  "version": "1.0"
}
```

You can verify this by:
1. Scanning the generated QR code with a QR scanner app
2. The scanner should show the JSON string above

## Mock vs Real API

### Current (Mock) Implementation:
```typescript
// In app/(dashboard)/inventory/page.tsx
const response = await mockGenerateQRCodes(selectedRowIds)
await mockDownloadQRCode(itemUid, qrCodeUrl)
await mockDownloadAllQRCodes(qrCodes)
```

### Switch to Real API (When Backend Ready):
```typescript
// Uncomment these lines:
const response = await generateQRCodes(selectedRowIds)
await downloadQRCode(itemUid, qrCodeUrl)
await downloadAllQRCodes(successfulItems)

// Remove mock imports and calls
```

## Key Differences: Mock vs Real

| Feature | Mock Implementation | Real API |
|---------|-------------------|----------|
| **QR Storage** | Base64 data URLs in memory | S3/file storage URLs |
| **Download All** | Sequential PNG downloads | Single ZIP file |
| **Latency** | 1-3 second random delay | Real network latency |
| **Error Rate** | 10% random failures | Real error conditions |
| **QR Content** | Mock JSON data | Real backend data |
| **Validation** | No validation | Backend validation |

## Known Limitations (Mock Only)

1. **No ZIP File:** Download All downloads PNGs sequentially instead of ZIP
2. **No Persistence:** QR codes lost on page refresh
3. **No Backend Validation:** Accepts any item UIDs
4. **Random Failures:** 10% error rate is artificial
5. **In-Memory Only:** QR codes not saved to database

## Troubleshooting

### Issue: QR codes not generating
**Solution:** Check browser console for errors. Ensure `qrcode` package is installed:
```bash
npm install qrcode @types/qrcode
```

### Issue: Download not working
**Solution:** Check browser's download settings. Some browsers block multiple downloads.

### Issue: Modal stuck on loading
**Solution:** Check network tab for failed requests. Refresh page and try again.

### Issue: TypeScript errors
**Solution:** Run type check:
```bash
npm run build
```

## Performance Testing

### Test Load Performance:
1. Generate 50+ QR codes at once
2. Monitor memory usage in DevTools
3. Check rendering performance

### Expected Performance:
- Generation: 1-3 seconds for any amount
- Rendering: <100ms for up to 50 QR codes
- Download: <1 second per PNG file

## Next Steps

### When Backend is Ready:
1. Implement real API endpoints (see `QR_GENERATION_API_INTEGRATION.md`)
2. Update imports in `inventory/page.tsx`
3. Replace mock calls with real API calls
4. Test with real data
5. Remove mock files (optional, can keep for testing)

### Backend Requirements:
```typescript
// POST /api/v1/qr-codes/generate
interface Request {
  itemUids: string[]
}

interface Response {
  success: boolean
  message: string
  data: Array<{
    itemUid: string
    qrCodeUrl: string
    status: "success" | "error"
    error?: string
  }>
}

// POST /api/v1/qr-codes/download-batch
// Returns: application/zip
```

## Additional Resources

- **QR Library Docs:** https://github.com/soldair/node-qrcode
- **API Integration:** See `QR_GENERATION_API_INTEGRATION.md`
- **QR Scanner:** See `QR_SCANNER_NOTIFICATIONS.md`

## Testing Checklist

- [ ] Generate QR codes for 1 item
- [ ] Generate QR codes for 5 items
- [ ] Generate QR codes for 20 items
- [ ] Download single QR code
- [ ] Download all QR codes
- [ ] Verify QR code content by scanning
- [ ] Test error handling (wait for random failures)
- [ ] Test modal open/close
- [ ] Test with no selection
- [ ] Test button enable/disable states
- [ ] Check toast notifications
- [ ] Verify loading states
- [ ] Test on mobile viewport
- [ ] Test dark mode compatibility

## Conclusion

The mock implementation provides a complete testing environment for the QR generation feature. All frontend functionality can be verified before backend integration. The mock closely simulates real API behavior including latency, errors, and data formats.

---
**Last Updated:** October 12, 2025  
**Version:** 1.0  
**Status:** Mock Testing Ready ✅
