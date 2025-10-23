# 📘 Hướng dẫn sử dụng PayOS - Dựa trên code hiện tại

## ✅ Code hiện tại của bạn (đang hoạt động tốt)

### Flow thanh toán hiện tại:
1. User điền form → Click "Pay"
2. Frontend gọi API `POST /payments/link` → nhận payment URL
3. Mở dialog confirm → Click "Go to payment"
4. Redirect sang trang PayOS (tab mới)
5. User thanh toán → PayOS redirect về `ReturnUrl` hoặc `CancelUrl`

**Ưu điểm:**
- ✅ Đơn giản, dễ hiểu
- ✅ Ít code, ít bug
- ✅ Redirect sang trang PayOS chính thống
- ✅ Đang hoạt động ổn định

---

## 🎯 Sau khi thanh toán - Bạn cần làm gì?

### 1. **Khi thanh toán THÀNH CÔNG** (User được redirect về `/subscription?success=true&...`)

#### Frontend cần làm:
```typescript
// Trong file: app/(dashboard)/subscription/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function SubscriptionPage() {
  const searchParams = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  
  useEffect(() => {
    const success = searchParams.get("success")
    const orderCode = searchParams.get("order")
    
    if (success === "true" && orderCode) {
      verifyPayment(orderCode)
    }
  }, [searchParams])
  
  const verifyPayment = async (orderCode: string) => {
    setIsVerifying(true)
    try {
      // GỌI API BACKEND ĐỂ VERIFY - QUAN TRỌNG!
      const response = await fetch(`/api/payments/verify/${orderCode}`)
      const data = await response.json()
      
      if (data.status === "PAID") {
        toast.success("Payment verified successfully!")
        // Show success UI, update subscription status
      } else {
        toast.error("Payment verification failed")
      }
    } catch (error) {
      toast.error("Error verifying payment")
    } finally {
      setIsVerifying(false)
    }
  }
  
  return (
    <div>
      {isVerifying && <p>Verifying payment...</p>}
      {/* Your subscription page UI */}
    </div>
  )
}
```

#### Backend cần làm (QUAN TRỌNG NHẤT):

**1. Webhook Handler - Nhận thông báo từ PayOS khi payment success:**

```csharp
// File: WebApi/Controllers/PaymentController.cs

[HttpPost("webhook")]
[AllowAnonymous]
public async Task<IActionResult> PayOsWebhook([FromBody] PayOsWebhookDto dto)
{
    try
    {
        // 1. Verify webhook signature (bảo mật)
        if (!_webhookService.VerifyPayOsSignature(Request.Headers, dto))
        {
            return Unauthorized();
        }

        // 2. Update order status trong database
        await _transactionService.UpdateStatus(dto.OrderCode, "PAID");

        // 3. Kích hoạt subscription cho user
        await _subscriptionService.Activate(dto.OrderCode);

        // 4. Gửi email xác nhận
        await _emailService.SendPaymentConfirmation(dto.OrderCode);

        return Ok();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Webhook error");
        return StatusCode(500);
    }
}
```

**2. Verify Payment API - Để frontend check:**

```csharp
[HttpGet("verify/{orderCode}")]
[Authorize]
public async Task<IActionResult> VerifyPayment(long orderCode)
{
    var transaction = await _transactionService.GetByOrderCode(orderCode);
    
    if (transaction == null)
        return NotFound();
    
    return Ok(new { 
        status = transaction.Status,
        orderCode = transaction.OrderCode,
        amount = transaction.Amount 
    });
}
```

---

### 2. **Khi thanh toán BỊ HỦY** (User được redirect về `/checkout?canceled=true&...`)

Code hiện tại của bạn đã xử lý:
```typescript
// Trong checkout/page.tsx - đã có sẵn
useEffect(() => {
  const canceled = searchParams.get("canceled")
  if (canceled === "true") {
    toast.error("Payment canceled")
    // Clean up URL
  }
}, [searchParams])
```

**Không cần làm gì thêm** - User có thể thử lại payment.

---

## 🔧 Backend cần implement (Priority)

### 1. **Webhook Handler** (CRITICAL - Phải có!)

Tại sao cần?
- Frontend có thể bị fake (user tự redirect về success URL)
- Webhook là cách DUY NHẤT tin cậy được từ PayOS
- PayOS gửi webhook KHI thanh toán thật sự thành công

```csharp
public class PayOsWebhookDto
{
    public long OrderCode { get; set; }
    public int Amount { get; set; }
    public string Status { get; set; } // "PAID" | "CANCELLED"
    public string TransactionId { get; set; }
    public DateTime PaidAt { get; set; }
}
```

**Cấu hình webhook URL trong PayOS Dashboard:**
```
https://yourdomain.com/api/payments/webhook
```

### 2. **Payment Verification API** (HIGH Priority)

```csharp
[HttpGet("payments/verify/{orderCode}")]
public async Task<IActionResult> VerifyPayment(long orderCode)
{
    // Check database
    var transaction = await _db.Transactions
        .FirstOrDefaultAsync(t => t.OrderCode == orderCode);
    
    return Ok(new { 
        status = transaction?.Status ?? "NOT_FOUND",
        orderCode = orderCode
    });
}
```

### 3. **Transaction Service** (Update status)

```csharp
public async Task UpdateStatus(long orderCode, string status)
{
    var transaction = await _db.Transactions
        .FirstOrDefaultAsync(t => t.OrderCode == orderCode);
    
    if (transaction != null)
    {
        transaction.Status = status;
        transaction.PaidAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }
}
```

---

## 🎨 Nếu muốn dùng PayOS SDK (OPTIONAL - không bắt buộc)

Code hiện tại bạn dùng redirect (tab mới) - đơn giản và ổn định.

Nếu muốn dùng Popup/Embedded (PayOS SDK), có 2 options:

### Option 1: Popup Payment
- Payment hiện trong popup window
- User không rời khỏi trang
- Tự động đóng khi thanh toán xong

### Option 2: Embedded Payment  
- Payment hiện ngay trong trang (iframe)
- Trải nghiệm mượt mà hơn
- Cần thêm code phức tạp hơn

**Nhưng đừng làm ngay!** Code hiện tại đang tốt rồi.

---

## 🔐 Security Best Practices

### ❌ ĐỪNG LÀM:
```typescript
// NGUY HIỂM - Tin tưởng URL params
const success = searchParams.get("success")
if (success === "true") {
  activateSubscription() // ⚠️ User có thể fake URL!
}
```

### ✅ NÊN LÀM:
```typescript
// AN TOÀN - Verify với backend
const orderCode = searchParams.get("order")
const verified = await fetch(`/api/payments/verify/${orderCode}`)
if (verified.status === "PAID") {
  showSuccessMessage()
}
```

---

## 📊 Flow hoàn chỉnh (Recommended)

```
┌─────────────────┐
│ User clicks Pay │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Frontend: Call API   │
│ POST /payments/link  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Backend: Create link │
│ Save to DB (PENDING) │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Frontend: Redirect   │
│ to PayOS             │
└────────┬─────────────┘
         │
    User pays
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│SUCCESS  │ │ CANCEL   │
└────┬────┘ └────┬─────┘
     │           │
     ▼           ▼
┌─────────────────────┐
│ PayOS sends WEBHOOK │ ← QUAN TRỌNG NHẤT!
│ to backend          │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Backend:            │
│ 1. Verify signature │
│ 2. Update DB (PAID) │
│ 3. Activate sub     │
│ 4. Send email       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ User redirected to  │
│ /subscription       │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│ Frontend:           │
│ Call verify API     │
│ Show success UI     │
└─────────────────────┘
```

---

## 🧪 Testing Checklist

### Test Case 1: Successful Payment
1. ✅ Click Pay → Dialog hiện
2. ✅ Click "Go to payment" → Mở PayOS tab
3. ✅ Complete payment trên PayOS
4. ✅ PayOS gửi webhook → Backend nhận được
5. ✅ Backend update DB → Status = PAID
6. ✅ PayOS redirect về /subscription?success=true
7. ✅ Frontend call verify API → Nhận status = PAID
8. ✅ Show success message

### Test Case 2: Cancel Payment
1. ✅ Click Pay → Mở PayOS
2. ✅ Click Cancel trên PayOS
3. ✅ Redirect về /checkout?canceled=true
4. ✅ Toast hiển thị "Payment canceled"
5. ✅ User có thể thử lại

### Test Case 3: Close Tab
1. ✅ Click Pay → Mở PayOS tab
2. ✅ Đóng tab ngay (không pay)
3. ✅ Order vẫn ở status PENDING
4. ✅ User có thể thử lại sau

---

## 🎯 Action Items (Theo thứ tự ưu tiên)

### 🔴 CRITICAL (Làm ngay):
1. [ ] Backend: Implement webhook handler
2. [ ] Backend: Implement verify payment API
3. [ ] Backend: Update transaction status service
4. [ ] Cấu hình webhook URL trong PayOS dashboard

### 🟡 HIGH (Làm sớm):
1. [ ] Frontend: Add payment verification trong subscription page
2. [ ] Backend: Add signature verification cho webhook
3. [ ] Backend: Send email confirmation
4. [ ] Testing end-to-end flow

### 🟢 MEDIUM (Làm sau):
1. [ ] Add payment history page
2. [ ] Add loading states
3. [ ] Add retry mechanism
4. [ ] Add analytics tracking

### 🔵 LOW (Optional):
1. [ ] Migrate to PayOS SDK (popup/embedded)
2. [ ] Add refund functionality
3. [ ] Add invoice generation

---

## 🐛 Common Issues & Solutions

### Issue 1: "Payment link not returned by server"
**Nguyên nhân:** Backend không trả về field `PaymentLink` hoặc `paymentLink`

**Solution:** Check backend response format:
```csharp
return Ok(new { PaymentLink = link }); // Hoặc paymentLink
```

### Issue 2: Webhook không được gọi
**Nguyên nhân:** Webhook URL chưa được config trong PayOS dashboard

**Solution:** 
1. Login vào https://my.payos.vn
2. Settings → Webhook URL
3. Nhập: `https://yourdomain.com/api/payments/webhook`

### Issue 3: User fake URL để có subscription free
**Nguyên nhân:** Không verify payment từ backend

**Solution:** Luôn luôn check status từ database, không tin tưởng URL params

---

## 📞 Support & Resources

- PayOS Dashboard: https://my.payos.vn
- PayOS Docs: https://payos.vn/docs
- Test Cards: https://payos.vn/docs/test-cards

---

## 💡 Kết luận

**CODE HIỆN TẠI CỦA BẠN ĐÃ TỐT!** Đừng thay đổi nếu không cần thiết.

**Chỉ cần bổ sung:**
1. ✅ Backend webhook handler
2. ✅ Backend verify API
3. ✅ Frontend verify payment sau khi redirect về

**Đó là tất cả!** Đơn giản và hiệu quả.

---

**Last updated:** October 22, 2025
