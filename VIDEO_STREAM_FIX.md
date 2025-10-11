# Video Stream "play() interrupted" Fix

## 🐛 Lỗi gốc:
```
The play() request was interrupted by a new load request. 
https://goo.gl/LdLk22
```

## 📋 Nguyên nhân:

Lỗi này xảy ra trong QR Scanner khi:

1. **Video stream bị stop đột ngột** khi scan thành công
2. **Không có cleanup** video stream đúng cách
3. **React re-render** gây unmount/remount video element quá nhanh
4. **MediaStream tracks** không được stop trước khi component unmount

### Chi tiết:
```tsx
// ❌ Trước đây:
onScan={(data) => {
  if (data) {
    setResult(data);
    setScanning(false);  // ← Stop ngay lập tức → Video element unmount → play() interrupted
  }
}}
```

Browser đang play video → Component unmount ngay → Browser không kịp stop → Lỗi!

---

## ✅ Giải pháp:

### 1. **Thêm videoStreamRef để track MediaStream**
```tsx
const videoStreamRef = useRef<MediaStream | null>(null);
```

### 2. **Cleanup stream khi component unmount**
```tsx
useEffect(() => {
  return () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
  };
}, []);
```

### 3. **Cleanup stream khi stop scanning**
```tsx
useEffect(() => {
  if (scanning) {
    // Initialize...
  } else {
    // Stop video stream when scanning stops
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
  }
}, [scanning]);
```

### 4. **Capture video stream từ video element**
```tsx
useEffect(() => {
  if (scanning && cameraReady) {
    const timer = setTimeout(() => {
      const videoElement = document.querySelector('video');
      if (videoElement && videoElement.srcObject) {
        videoStreamRef.current = videoElement.srcObject as MediaStream;
      }
    }, 500);
    return () => clearTimeout(timer);
  }
}, [scanning, cameraReady]);
```

### 5. **Delay stop scanning để smooth transition**
```tsx
const handleScanSuccess = (data: string) => {
  setResult(data);
  setDetected(true);
  setError("");
  setCameraPermission('granted');
  
  // Animation delay
  setTimeout(() => setDetected(false), 1000);
  
  // ✅ Stop scanning sau 1.5s thay vì ngay lập tức
  setTimeout(() => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
      videoStreamRef.current = null;
    }
    setScanning(false);
  }, 1500);
};
```

### 6. **Cleanup trong handleReset**
```tsx
const handleReset = () => {
  // Stop video stream first
  if (videoStreamRef.current) {
    videoStreamRef.current.getTracks().forEach(track => track.stop());
    videoStreamRef.current = null;
  }
  
  // Then reset states
  setResult("");
  setScanning(false);
  // ...
};
```

---

## 🎯 Flow mới:

```
Scan QR Code thành công
    ↓
handleScanSuccess() gọi
    ↓
setResult(data) + setDetected(true)
    ↓
Show animation (1s)
    ↓
Đợi 1.5s để UX mượt
    ↓
Stop video tracks từ videoStreamRef
    ↓
videoStreamRef = null
    ↓
setScanning(false)
    ↓
Video element unmount an toàn
    ↓
✅ Không có lỗi!
```

---

## 🔍 Tại sao cần delay 1.5s?

1. **UX tốt hơn:** Người dùng thấy animation "QR Code Detected!" đầy đủ
2. **Tránh jarring:** Không bị giật màn hình khi video stop đột ngột  
3. **Browser có thời gian:** Stop video stream một cách graceful
4. **Tránh race condition:** Đảm bảo video đã play xong trước khi stop

---

## 📊 So sánh:

### ❌ Trước:
```
Scan → Stop ngay → Video unmount → play() interrupted → Lỗi console
```

### ✅ Sau:
```
Scan → Show animation → Delay 1.5s → Stop tracks → Stop scanning → Clean unmount
```

---

## 🧪 Test cases:

- [x] Scan QR bằng camera → Không có lỗi console
- [x] Nhấn "Scan Another" → Camera restart bình thường
- [x] Upload ảnh → Không ảnh hưởng camera
- [x] Unmount component (navigate away) → Stream cleanup đúng
- [x] Scan nhiều lần liên tiếp → Không memory leak
- [x] Error camera permission → Cleanup đúng

---

## 💡 Best practices áp dụng:

1. **Luôn cleanup MediaStream:**
   ```tsx
   stream.getTracks().forEach(track => track.stop())
   ```

2. **Sử dụng refs cho external resources:**
   ```tsx
   const videoStreamRef = useRef<MediaStream | null>(null)
   ```

3. **Cleanup trong useEffect return:**
   ```tsx
   useEffect(() => {
     return () => { /* cleanup */ }
   }, [])
   ```

4. **Delay actions để smooth UX:**
   ```tsx
   setTimeout(() => { /* action */ }, delay)
   ```

5. **Null check trước khi cleanup:**
   ```tsx
   if (ref.current) { /* cleanup */ }
   ```

---

## ✅ Kết quả:

- ✅ Không còn lỗi "play() interrupted" trong console
- ✅ Camera stream được cleanup đúng cách
- ✅ UX mượt mà với animation
- ✅ Không memory leak
- ✅ Scan nhiều lần không bị lỗi
- ✅ Navigate away không có warning

---

**Ngày fix:** October 11, 2025  
**Mức độ:** Medium (Video/Audio API)  
**Impact:** High (Console clean, better UX)  
**Status:** ✅ Resolved
