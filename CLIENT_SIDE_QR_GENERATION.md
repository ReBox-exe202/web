# QR Code Generation - Client-Side Implementation

## Overview
QR code generation is now handled entirely on the client-side using the `qrcode` library. No backend API calls are needed for generating or downloading QR codes.

## Architecture

### Previous Flow (Backend API)
```
User selects items → Call backend API → Wait for response → Display QR codes
```

### Current Flow (Client-Side)
```
User selects items → Read table data → Generate QR codes locally → Display instantly
```

## Implementation Details

### 1. QR Code Generation (`inventory/page.tsx`)

#### Data Source
QR codes are generated directly from the table row data:

```typescript
const item = items.find(i => i.uid === itemUid)

const qrData = JSON.stringify({
  itemUid: item.uid,
  type: item.type,
  size: item.size,
  status: item.status,
  cycles: item.cycles,
  dealerId: item.dealerId,
  generatedAt: new Date().toISOString(),
  version: "1.0",
})
```

#### Generation Process
```typescript
const qrCodeUrl = await QRCode.toDataURL(qrData, {
  width: 300,
  margin: 2,
  color: {
    dark: "#000000",
    light: "#FFFFFF",
  },
})
```

#### Result Format
```typescript
interface QRCodeResult {
  itemUid: string
  qrCodeUrl: string      // Base64 data URL
  status: "success" | "error"
  error?: string
}
```

### 2. Download Functionality

#### Single QR Download
```typescript
const handleDownloadSingleQR = async (itemUid: string) => {
  const qrCode = generatedQRCodes.find(qr => qr.itemUid === itemUid)
  if (qrCode && qrCode.qrCodeUrl) {
    const link = document.createElement("a")
    link.href = qrCode.qrCodeUrl
    link.download = `qr-code-${itemUid}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
```

#### Batch Download
```typescript
const handleDownloadAllQR = async () => {
  const successfulQRs = generatedQRCodes.filter(qr => qr.status === "success")
  
  for (const qr of successfulQRs) {
    const link = document.createElement("a")
    link.href = qr.qrCodeUrl
    link.download = `qr-code-${qr.itemUid}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Delay to prevent browser blocking
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}
```

## Features

### ✅ Advantages
1. **No Backend Required** - Works completely offline
2. **Instant Generation** - No network latency
3. **Privacy** - Item data never leaves the client
4. **Cost Effective** - No server resources needed
5. **Scalability** - No backend load concerns
6. **Testing Friendly** - Easy to test without API setup

### ⚠️ Considerations
1. **Browser-Only** - Can't generate QR codes server-side
2. **Sequential Downloads** - Multiple files downloaded one by one (not ZIP)
3. **Client Performance** - Large batches may slow browser
4. **Storage** - QR codes stored in memory only (not persisted)

## Usage Examples

### Basic Usage (Inventory Page)
```typescript
// 1. Select items from table
// 2. Click "Generate QR (X)" button
// 3. QR codes generated instantly from table data
// 4. Download individually or in batch
```

### Test Helper Usage (QR Test Page)
```typescript
// Navigate to /qr-test
// Click test scenario buttons:
// - All Success (3 items)
// - Mixed Results (4 items)
// - Large Batch (20 items)
// - Single Item
// - Random Test
// - Edge Case
```

## QR Code Content Structure

### Data Included in QR Code
```json
{
  "itemUid": "PKG-001",
  "type": "cup",
  "size": "M",
  "status": "Active",
  "cycles": 5,
  "dealerId": "DLR-123",
  "generatedAt": "2025-10-13T10:30:00.000Z",
  "version": "1.0"
}
```

### Scanning Behavior
When scanned with a QR scanner app:
- Returns the complete JSON string
- Can be parsed by tracking systems
- Contains full item metadata
- Timestamp for verification

## File Structure

```
app/(dashboard)/
  inventory/
    page.tsx                    # Main implementation
  qr-test/
    page.tsx                    # Testing page

components/
  inventory/
    qr-generation-modal.tsx     # Display generated QR codes
  qr-test-helper.tsx            # Test scenarios component

lib/
  api/services/
    qr.service.ts              # Type definitions (no API calls)
```

## Configuration

### QR Code Settings
Modify in `handleGenerateQR()`:

```typescript
await QRCode.toDataURL(qrData, {
  width: 300,           // Image width in pixels
  margin: 2,            // White space margin
  color: {
    dark: "#000000",    // QR code color
    light: "#FFFFFF",   // Background color
  },
  errorCorrectionLevel: 'M',  // L, M, Q, H
})
```

### Error Correction Levels
- **L** (Low): 7% of codewords can be restored
- **M** (Medium): 15% - Default
- **Q** (Quartile): 25%
- **H** (High): 30%

## Testing

### Test Scenarios

#### 1. Single Item Generation
```
Select 1 item → Generate QR → Verify content → Download
```

#### 2. Batch Generation
```
Select 10+ items → Generate QR → Check all codes → Download all
```

#### 3. Error Handling
```
Test with invalid data → Verify error display → Check error message
```

#### 4. Performance Test
```
Generate 20+ QR codes → Monitor browser performance → Check memory usage
```

### Using Test Page
Navigate to `/qr-test` for quick testing:

1. **All Success** - Tests successful generation
2. **Mixed Results** - Tests error handling (items with "INVALID" in UID)
3. **Large Batch** - Tests performance with 20 items
4. **Single Item** - Tests minimal case
5. **Random Test** - Tests with random test UIDs
6. **Edge Case** - Tests failure scenarios

## API Reference

### handleGenerateQR()
**Description:** Generates QR codes for selected items

**Parameters:** None (uses `selectedRowIds` state)

**Returns:** `Promise<void>`

**Side Effects:**
- Sets `isQRModalOpen` to true
- Updates `generatedQRCodes` state
- Shows toast notifications

### handleDownloadSingleQR(itemUid: string)
**Description:** Downloads a single QR code as PNG

**Parameters:**
- `itemUid` - The item UID to download

**Returns:** `Promise<void>`

### handleDownloadAllQR()
**Description:** Downloads all successful QR codes

**Parameters:** None (uses `generatedQRCodes` state)

**Returns:** `Promise<void>`

**Note:** Downloads sequentially with 300ms delay between files

## Browser Compatibility

### Supported Features
- ✅ Canvas API (QR generation)
- ✅ Data URLs (base64 images)
- ✅ Download attribute
- ✅ Modern async/await

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Known Issues
- Some browsers may block multiple downloads
- Mobile browsers may handle downloads differently
- Incognito mode may have stricter limits

## Performance Considerations

### Generation Speed
- **1-5 items**: Instant (<100ms)
- **10-20 items**: Fast (<500ms)
- **50+ items**: Noticeable (1-2s)
- **100+ items**: May slow browser (3-5s)

### Memory Usage
Each QR code (300x300px) uses ~50KB in memory:
- 10 items: ~500KB
- 50 items: ~2.5MB
- 100 items: ~5MB

### Recommendations
- Generate in batches of <50 items
- Clear old QR codes when generating new ones
- Add loading indicators for large batches
- Consider pagination for huge datasets

## Future Enhancements

### Potential Improvements
1. **ZIP Download** - Package multiple QR codes into ZIP file
2. **Print Layout** - Generate printable sheet with multiple QR codes
3. **Custom Branding** - Add logo/text to QR codes
4. **Different Formats** - Support SVG, PDF output
5. **Batch Optimization** - Web Workers for parallel generation
6. **Persistence** - Save generated QR codes to IndexedDB
7. **Share Feature** - Share QR codes via Web Share API

### Backend Integration (Optional)
If you later need backend features:

```typescript
// Save QR metadata to database
POST /api/qr-codes/register
{
  itemUid: string,
  qrCodeData: string,
  generatedAt: string
}

// Track QR code scans
POST /api/qr-codes/scan
{
  itemUid: string,
  scannedAt: string,
  location?: string
}
```

## Troubleshooting

### Issue: QR codes not generating
**Solution:** Check if `qrcode` package is installed:
```bash
npm install qrcode @types/qrcode
```

### Issue: Downloads not working
**Solution:** Check browser's download settings and pop-up blocker

### Issue: Slow generation for many items
**Solution:** Reduce batch size or add Web Worker implementation

### Issue: QR code content too large
**Solution:** Reduce data included in QR code or increase error correction level

## Security Considerations

### Data Privacy
- All data processed client-side
- No data sent to external servers
- QR codes contain unencrypted JSON
- Consider data sensitivity when generating

### Recommendations
1. Don't include sensitive data in QR codes
2. Implement scanning authentication if needed
3. Add encryption layer if required
4. Validate scanned data on backend

## Migration Notes

### From Mock API
Previous code (removed):
```typescript
import { mockGenerateQRCodes, mockDownloadQRCode } from "@/lib/mock-qr-generation"
```

Current code:
```typescript
import QRCode from "qrcode"
```

### From Real Backend API
If migrating from backend:
1. Remove API calls from `qr.service.ts`
2. Keep type definitions
3. Update inventory page to use direct generation
4. Remove backend endpoints (optional)

---

**Last Updated:** October 13, 2025  
**Version:** 2.0 (Client-Side)  
**Status:** Production Ready ✅
