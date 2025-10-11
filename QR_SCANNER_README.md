# QR Scanner Component - Hướng dẫn sử dụng

## ✨ Tính năng

### 1. Quét QR bằng Camera
- Tự động bật camera khi vào trang
- Khung căn chỉnh 4 góc với animation
- Đường quét di chuyển (scanning line)
- Hiệu ứng khi phát hiện thành công
- Badge status realtime

### 2. Quét QR từ Ảnh (Mới!)
- Upload ảnh từ thư viện/gallery
- Hỗ trợ tất cả định dạng ảnh (PNG, JPG, JPEG, WebP, etc.)
- Tự động detect và decode QR code từ ảnh
- Toast notification cho feedback

### 3. Xử lý Kết quả
- Hiển thị nội dung QR code
- Copy to clipboard
- Scan Another - quét tiếp QR khác

## 🚀 Cách sử dụng

### Import Component
```tsx
import QRScanner from "@/components/qr-scanner";

export default function QRPage() {
  return <QRScanner />;
}
```

### Sử dụng Camera
1. Truy cập trang `/qr` trong dashboard
2. Cho phép quyền camera khi browser hỏi
3. Đưa mã QR vào trong khung căn chỉnh
4. Kết quả hiển thị tự động

### Sử dụng Upload Ảnh
1. Click button "Upload QR Image from Gallery"
2. Chọn ảnh chứa QR code từ thiết bị
3. Hệ thống tự động scan và hiển thị kết quả

## 📦 Dependencies

```json
{
  "react-qr-reader-es6": "^1.x.x",  // Quét QR từ camera
  "jsqr": "^1.x.x",                  // Decode QR từ ảnh
  "sonner": "^1.x.x"                 // Toast notifications
}
```

## 🎨 UI/UX Features

- **Responsive Design**: Hoạt động tốt trên mobile & desktop
- **Dark Mode Support**: Tự động adapt với theme
- **Loading States**: Spinner khi đang xử lý ảnh
- **Error Handling**: Thông báo rõ ràng cho các lỗi
- **Animations**: Smooth transitions & effects

## 🔧 Xử lý Lỗi

### Camera Errors
- **NotAllowedError**: Người dùng từ chối quyền camera
- **NotFoundError**: Không tìm thấy camera trên thiết bị

### Image Upload Errors
- **Invalid file type**: File không phải ảnh
- **No QR found**: Ảnh không chứa QR code hoặc không rõ
- **Processing error**: Lỗi khi xử lý ảnh

## 💡 Tips

1. **Để quét tốt hơn bằng camera**:
   - Giữ camera ổn định
   - Đảm bảo ánh sáng đủ
   - QR code nằm hoàn toàn trong khung

2. **Để quét tốt hơn từ ảnh**:
   - Chọn ảnh có độ phân giải cao
   - QR code rõ ràng, không bị mờ
   - Ảnh không bị nghiêng quá nhiều

## 🔄 API Reference

### State Variables
- `result`: Kết quả QR code đã quét
- `error`: Thông báo lỗi (nếu có)
- `scanning`: Trạng thái đang scan
- `detected`: Trạng thái vừa detect thành công
- `isProcessing`: Đang xử lý ảnh upload

### Methods
- `handleReset()`: Reset về trạng thái ban đầu
- `handleFileUpload(event)`: Xử lý upload ảnh

## 🎯 Browser Support

- ✅ Chrome/Edge (Modern)
- ✅ Firefox (Modern)
- ✅ Safari (iOS 14+)
- ✅ Mobile browsers with camera access

## 📱 Mobile Optimization

- Touch-friendly buttons
- Responsive camera view
- Native file picker integration
- Optimized for mobile performance
