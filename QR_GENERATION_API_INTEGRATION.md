# QR Code Generation with API Integration

## ✅ Tính năng đã implement

### **Flow hoàn chỉnh:**
1. User chọn items trong table → Nút "Generate QR" enabled
2. Click "Generate QR" → Modal mở với loading state
3. Call API backend để generate QR codes
4. Hiển thị QR codes trong modal khi API trả về response
5. Download individual hoặc batch QR codes

## 🏗️ Architecture

### **1. Components Created**

#### **QRGenerationModal** (`components/inventory/qr-generation-modal.tsx`)
```tsx
interface QRGenerationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: string[]
  isLoading: boolean
  qrCodes: QRCode[]
  onDownloadAll?: () => void
  onDownloadSingle?: (itemUid: string) => void
}
```

**Features:**
- Loading state với spinner và progress bar
- Grid layout hiển thị QR codes
- Download individual QR code
- Download all QR codes as ZIP
- Error handling per QR code
- Responsive design (2-3 columns)

#### **QR Service** (`lib/api/services/qr.service.ts`)
```typescript
// Generate QR codes
generateQRCodes(itemUids: string[]): Promise<GenerateQRResponse>

// Download single QR
downloadQRCode(itemUid: string, qrCodeUrl: string): Promise<void>

// Download batch as ZIP
downloadAllQRCodes(itemUids: string[]): Promise<void>
```

### **2. API Integration**

#### **Endpoint: POST /qr-codes/generate**
```typescript
// Request
{
  itemUids: string[]  // ["PKG-001", "PKG-002", ...]
}

// Response
{
  success: boolean
  message: string
  data: [
    {
      itemUid: "PKG-001"
      qrCodeUrl: "https://api.example.com/qr/PKG-001.png"
      status: "success" | "error"
      error?: string
    }
  ]
}
```

#### **Endpoint: POST /qr-codes/download-batch**
```typescript
// Request
{
  itemUids: string[]
}

// Response: ZIP file (binary)
```

### **3. State Management**

```typescript
// Inventory Page State
const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
const [isQRModalOpen, setIsQRModalOpen] = useState(false)
const [isGeneratingQR, setIsGeneratingQR] = useState(false)
const [generatedQRCodes, setGeneratedQRCodes] = useState<QRCodeResult[]>([])
```

## 🔄 Complete User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. SELECT ITEMS                                             │
├─────────────────────────────────────────────────────────────┤
│ User: Check checkboxes in table                            │
│ System: Enable "Generate QR (3)" button                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. CLICK GENERATE                                           │
├─────────────────────────────────────────────────────────────┤
│ User: Click "Generate QR (3)" button                        │
│ System: Open modal with loading spinner                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. API CALL                                                 │
├─────────────────────────────────────────────────────────────┤
│ System: POST /qr-codes/generate                            │
│ Payload: { itemUids: ["PKG-001", "PKG-002", "PKG-003"] }  │
│ Status: Loading... (showing spinner)                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. DISPLAY RESULTS                                          │
├─────────────────────────────────────────────────────────────┤
│ System: Hide loading, show QR codes in grid               │
│ Display: 3 QR codes with download buttons                  │
│ Success toast: "Successfully generated 3 QR codes"         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. DOWNLOAD OPTIONS                                         │
├─────────────────────────────────────────────────────────────┤
│ Option A: Click individual download → PNG file             │
│ Option B: Click "Download All" → ZIP file                  │
└─────────────────────────────────────────────────────────────┘
```

## 🎨 Modal UI States

### **State 1: Loading**
```
╔════════════════════════════════════════════════════════╗
║              Generate QR Codes                         ║
║  Generating QR codes for 3 items...                   ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║                    [◐ Spinner]                        ║
║                                                        ║
║              Generating QR Codes...                    ║
║               Processing 3 items                       ║
║                                                        ║
║           [████████████░░░░░░] 60%                    ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
```

### **State 2: Success (Grid View)**
```
╔════════════════════════════════════════════════════════╗
║              Generate QR Codes                         ║
║  Successfully generated 3 QR codes                     ║
╠════════════════════════════════════════════════════════╣
║  3 of 3 successful            [Download All]          ║
║                                                        ║
║  ┌─────────┐  ┌─────────┐  ┌─────────┐              ║
║  │ PKG-001 │  │ PKG-002 │  │ PKG-003 │              ║
║  │   [↓]   │  │   [↓]   │  │   [↓]   │              ║
║  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │              ║
║  │ ▓▓░░▓▓░ │  │ ░▓▓▓░▓▓ │  │ ▓░▓▓░▓░ │              ║
║  │ ░▓▓░░░▓ │  │ ░░▓▓░░░ │  │ ░▓░░▓▓▓ │              ║
║  │ ▓░░▓▓▓░ │  │ ▓░░░▓▓▓ │  │ ▓▓░░░░▓ │              ║
║  │ ░░░░░░░ │  │ ░░░░░░░ │  │ ░░░░░░░ │              ║
║  └─────────┘  └─────────┘  └─────────┘              ║
╚════════════════════════════════════════════════════════╝
```

### **State 3: Partial Success**
```
╔════════════════════════════════════════════════════════╗
║              Generate QR Codes                         ║
║  Successfully generated 2 QR codes                     ║
╠════════════════════════════════════════════════════════╣
║  2 of 3 successful            [Download All]          ║
║                                                        ║
║  ┌─────────┐  ┌─────────┐  ┌─────────┐              ║
║  │ PKG-001 │  │ PKG-002 │  │ PKG-003 │              ║
║  │   [↓]   │  │   [↓]   │  │    ✕    │              ║
║  │ ░░░░░░░ │  │ ░░░░░░░ │  │         │              ║
║  │ ▓▓░░▓▓░ │  │ ░▓▓▓░▓▓ │  │  Error  │              ║
║  │ (QR)    │  │ (QR)    │  │ Failed  │              ║
║  └─────────┘  └─────────┘  └─────────┘              ║
╚════════════════════════════════════════════════════════╝
```

## 💻 Code Implementation

### **Inventory Page - Generate Handler**
```typescript
const handleGenerateQR = async () => {
  if (selectedRowIds.length === 0) {
    toast.error("No items selected")
    return
  }

  // 1. Open modal với loading
  setIsQRModalOpen(true)
  setIsGeneratingQR(true)
  setGeneratedQRCodes([])

  try {
    // 2. Call API
    const response = await generateQRCodes(selectedRowIds)
    
    // 3. Update state với results
    setGeneratedQRCodes(response.data)
    setIsGeneratingQR(false)
    
    // 4. Success toast
    const successCount = response.data.filter(qr => qr.status === "success").length
    toast.success(`Successfully generated ${successCount} QR codes`)
  } catch (error) {
    // 5. Error handling
    setIsGeneratingQR(false)
    toast.error("Generation Failed")
    setIsQRModalOpen(false)
  }
}
```

### **API Service - Generate QR**
```typescript
export async function generateQRCodes(itemUids: string[]): Promise<GenerateQRResponse> {
  const response = await axiosClient.post<GenerateQRResponse>("/qr-codes/generate", {
    itemUids,
  })
  return response.data
}
```

### **DataTable - Selection Callback**
```typescript
onRowSelectionChange: (updater) => {
  const newSelection = typeof updater === "function" ? updater(rowSelection) : updater
  setRowSelection(newSelection)
  
  if (onRowSelectionChange) {
    const selectedCount = Object.keys(newSelection).length
    const selectedIds = Object.keys(newSelection)
      .filter(key => newSelection[key])
      .map(index => {
        const row = table.getRowModel().rows[parseInt(index)]
        return (row?.original as any)?.uid || ""
      })
      .filter(Boolean)
    
    onRowSelectionChange(selectedCount, selectedIds)
  }
}
```

## 📊 Response Handling

### **Success Response**
```json
{
  "success": true,
  "message": "QR codes generated successfully",
  "data": [
    {
      "itemUid": "PKG-001",
      "qrCodeUrl": "https://api.example.com/qr/PKG-001.png",
      "status": "success"
    },
    {
      "itemUid": "PKG-002",
      "qrCodeUrl": "https://api.example.com/qr/PKG-002.png",
      "status": "success"
    }
  ]
}
```

### **Partial Success Response**
```json
{
  "success": true,
  "message": "Partial generation completed",
  "data": [
    {
      "itemUid": "PKG-001",
      "qrCodeUrl": "https://api.example.com/qr/PKG-001.png",
      "status": "success"
    },
    {
      "itemUid": "PKG-002",
      "qrCodeUrl": "",
      "status": "error",
      "error": "Invalid item UID format"
    }
  ]
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Failed to generate QR codes",
  "error": "Service unavailable"
}
```

## 🧪 Testing Scenarios

### **Scenario 1: Successful Generation**
```
1. Select 3 items in table
2. Click "Generate QR (3)"
3. Modal opens with loading spinner
4. Wait 2 seconds (API call)
5. Modal shows 3 QR codes in grid
6. Toast: "Successfully generated 3 QR codes"
7. Click "Download All" → ZIP file downloads
```

### **Scenario 2: Partial Failure**
```
1. Select 3 items (1 invalid UID)
2. Click "Generate QR (3)"
3. Modal shows loading
4. API returns 2 success, 1 error
5. Modal shows 2 QR codes + 1 error card
6. Toast: "Successfully generated 2 of 3 QR codes"
7. Only 2 QR codes available for download
```

### **Scenario 3: Complete Failure**
```
1. Select items
2. Click "Generate QR"
3. Modal shows loading
4. API returns error (network issue)
5. Modal closes
6. Toast: "Generation Failed - Please try again"
```

### **Scenario 4: No Selection**
```
1. No items selected (count = 0)
2. Button is disabled
3. Cannot click (grayed out)
4. User must select items first
```

## 🎯 Features

### **✅ Modal Features:**
- Responsive grid (2-3 columns)
- Scrollable content (max height 400px)
- Individual download buttons
- Batch download button
- Success/error indicators per QR
- Loading state with progress indication

### **✅ API Features:**
- Batch generation (multiple items)
- Individual QR URLs returned
- Error handling per item
- ZIP batch download
- Progress tracking (optional)

### **✅ UX Features:**
- Loading spinner during generation
- Success count display
- Error details per item
- Toast notifications
- Download confirmation
- Close modal after download

## 📁 File Structure

```
app/(dashboard)/inventory/
  └── page.tsx                    # Main inventory page with modal integration

components/inventory/
  └── qr-generation-modal.tsx     # QR generation modal component

lib/api/services/
  └── qr.service.ts               # QR API service functions

components/tracking/
  └── data-table.tsx              # Enhanced with selection IDs
```

## 🚀 Future Enhancements

- [ ] Real-time progress updates during generation
- [ ] Batch size limits (e.g., max 50 per request)
- [ ] QR code customization (size, color, logo)
- [ ] Preview before download
- [ ] Email QR codes option
- [ ] Print preview sheet (A4 layout)
- [ ] QR code history/tracking
- [ ] Retry failed generations
- [ ] Auto-save generated QR codes
- [ ] Share QR codes via link

## ✨ Benefits

1. **Efficient Workflow:** Generate multiple QR codes at once
2. **Visual Feedback:** See QR codes immediately after generation
3. **Error Resilience:** Partial success handled gracefully
4. **Flexible Download:** Individual or batch download options
5. **Professional UX:** Loading states, toasts, responsive design
