# Generate QR Button - Dynamic Enable/Disable

## ✅ Tính năng đã implement

### **Trạng thái nút Generate QR:**
- ❌ **Disabled by default** - Khi không có row nào được chọn
- ✅ **Enabled** - Khi có ít nhất 1 row được chọn
- 📊 **Show count** - Hiển thị số lượng items đã chọn

## 🔧 Implementation

### **1. State Management**
```typescript
const [selectedRowCount, setSelectedRowCount] = useState<number>(0)
```

### **2. Button với disabled state**
```tsx
<Button 
  size="sm" 
  onClick={handleGenerateQR}
  disabled={selectedRowCount === 0}
>
  <Plus className="mr-2 h-4 w-4" />
  Generate QR {selectedRowCount > 0 && `(${selectedRowCount})`}
</Button>
```

**UI States:**
- No selection: `Generate QR` (disabled, grayed out)
- 1 selected: `Generate QR (1)` (enabled)
- Multiple selected: `Generate QR (5)` (enabled)

### **3. Toast Notification**
```typescript
const handleGenerateQR = () => {
  toast.success("QR Generation started", {
    description: `Generating QR codes for ${selectedRowCount} selected item${selectedRowCount > 1 ? 's' : ''}.`,
  })
}
```

**Messages:**
- 1 item: "Generating QR codes for 1 selected item."
- Multiple: "Generating QR codes for 5 selected items."

### **4. DataTable Enhancement**

**Interface:**
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  namespace: string
  onExportCSV?: () => void
  onRowSelectionChange?: (selectedCount: number) => void  // New!
}
```

**Selection Handler:**
```typescript
onRowSelectionChange: (updater) => {
  const newSelection = typeof updater === "function" ? updater(rowSelection) : updater
  setRowSelection(newSelection)
  
  // Notify parent component
  if (onRowSelectionChange) {
    const selectedCount = Object.keys(newSelection).length
    onRowSelectionChange(selectedCount)
  }
},
```

### **5. Parent Component Usage**
```tsx
<DataTable 
  columns={columns} 
  data={filteredItems} 
  namespace="inventoryTable"
  onRowSelectionChange={setSelectedRowCount}  // Pass callback
/>
```

## 🎨 Visual States

### **State 1: No Selection (Disabled)**
```
╔═══════════════════════════════════════════════════════╗
║  Inventory Management          [Export] [Generate QR] ║
║                                          ^disabled     ║
╠═══════════════════════════════════════════════════════╣
║  [ ] PKG-001  Cup  M  Active  12                      ║
║  [ ] PKG-002  Box  L  Active  8                       ║
╚═══════════════════════════════════════════════════════╝
```

### **State 2: 1 Item Selected**
```
╔═══════════════════════════════════════════════════════╗
║  Inventory Management      [Export] [Generate QR (1)] ║
║                                      ^enabled, count   ║
╠═══════════════════════════════════════════════════════╣
║  [✓] PKG-001  Cup  M  Active  12                      ║
║  [ ] PKG-002  Box  L  Active  8                       ║
╚═══════════════════════════════════════════════════════╝
```

### **State 3: Multiple Items Selected**
```
╔═══════════════════════════════════════════════════════╗
║  Inventory Management      [Export] [Generate QR (5)] ║
║                                      ^enabled, count   ║
╠═══════════════════════════════════════════════════════╣
║  [✓] PKG-001  Cup  M  Active  12                      ║
║  [✓] PKG-002  Box  L  Active  8                       ║
║  [✓] PKG-003  Bowl S  Active  15                      ║
║  [✓] PKG-004  Cup  L  Active  10                      ║
║  [✓] PKG-005  Box  M  Active  6                       ║
╚═══════════════════════════════════════════════════════╝
```

## 🔄 User Flow

```
1. Page loads
   ↓
   Button: "Generate QR" (disabled, gray)
   
2. User clicks checkbox on row
   ↓
   onRowSelectionChange callback triggered
   ↓
   selectedCount = 1
   ↓
   Button: "Generate QR (1)" (enabled, primary color)
   
3. User clicks more checkboxes
   ↓
   selectedCount = 5
   ↓
   Button: "Generate QR (5)" (enabled)
   
4. User unchecks all
   ↓
   selectedCount = 0
   ↓
   Button: "Generate QR" (disabled, gray)
```

## 🎯 Benefits

### **1. Better UX:**
- ✅ Visual feedback - User knows button state
- ✅ Count display - User sees how many selected
- ✅ Prevents errors - Can't generate without selection

### **2. Clear Communication:**
- Toast shows exact count
- Button label updates dynamically
- Disabled state prevents confusion

### **3. Professional Feel:**
- Standard pattern in data management UIs
- Follows best practices
- Intuitive interaction

## 🧪 Testing Scenarios

### **Scenario 1: Default State**
```
Action: Load page
Expected: Button disabled, text "Generate QR"
```

### **Scenario 2: Select One Item**
```
Action: Check one checkbox
Expected: Button enabled, text "Generate QR (1)"
Action: Click button
Expected: Toast "Generating QR codes for 1 selected item."
```

### **Scenario 3: Select Multiple Items**
```
Action: Check 5 checkboxes
Expected: Button enabled, text "Generate QR (5)"
Action: Click button
Expected: Toast "Generating QR codes for 5 selected items."
```

### **Scenario 4: Select All**
```
Action: Click header checkbox
Expected: All rows selected, button shows total count
```

### **Scenario 5: Unselect All**
```
Action: Uncheck all items
Expected: Button disabled, count removed
```

### **Scenario 6: Mixed Selection**
```
Action: Select some, unselect some
Expected: Count updates in real-time
```

## 💡 Implementation Notes

### **Why callback instead of context?**
- Simpler implementation
- Less overhead
- Direct parent-child communication
- No prop drilling needed

### **Why count in button label?**
- Immediate feedback
- No need to look at table
- Quick validation before action
- Standard pattern (e.g., Gmail, Google Drive)

### **Why disable instead of hide?**
- Discoverable - Users know feature exists
- Consistent layout - No jumping
- Clear affordance - Users learn requirement

## 🚀 Future Enhancements

### **Potential Improvements:**
- [ ] Show "Select All" quick action when 0 selected
- [ ] Preview selected items before generation
- [ ] Batch size warning for large selections
- [ ] Progress indicator during generation
- [ ] Download generated QR codes as ZIP
- [ ] Option to email QR codes to dealers

### **Advanced Features:**
- [ ] Remember last selection
- [ ] Quick select by filter (e.g., "Active only")
- [ ] Undo/redo selection
- [ ] Keyboard shortcuts (Ctrl+A, etc.)

## 📊 Related Components

- **Inventory Page:** `app/(dashboard)/inventory/page.tsx`
- **DataTable:** `components/tracking/data-table.tsx`
- **Button:** `components/ui/button.tsx`
- **Toast:** `sonner` library

## ✨ Code Summary

```typescript
// Inventory Page
const [selectedRowCount, setSelectedRowCount] = useState<number>(0)

<Button 
  disabled={selectedRowCount === 0}
>
  Generate QR {selectedRowCount > 0 && `(${selectedRowCount})`}
</Button>

<DataTable 
  onRowSelectionChange={setSelectedRowCount}
/>

// DataTable Component
onRowSelectionChange: (updater) => {
  const newSelection = typeof updater === "function" ? updater(rowSelection) : updater
  setRowSelection(newSelection)
  if (onRowSelectionChange) {
    onRowSelectionChange(Object.keys(newSelection).length)
  }
}
```
