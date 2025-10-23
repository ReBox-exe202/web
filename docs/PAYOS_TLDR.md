# ⚡ PayOS - TL;DR

## Code hiện tại: ✅ ĐANG HOẠT ĐỘNG TỐT - ĐỪNG SỬA!

---

## Sau thanh toán bạn cần làm gì?

### 1️⃣ Backend: Tạo Webhook Handler (QUAN TRỌNG NHẤT!)

```csharp
// File: WebApi/Controllers/PaymentController.cs

[HttpPost("webhook")]
[AllowAnonymous]
public async Task<IActionResult> PayOsWebhook([FromBody] PayOsWebhookDto dto)
{
    // ✅ PayOS tự động gọi endpoint này khi payment thành công
    
    // 1. Update order status
    await _transactionService.UpdateStatus(dto.OrderCode, "PAID");
    
    // 2. Kích hoạt subscription
    await _subscriptionService.Activate(dto.OrderCode);
    
    // 3. Gửi email
    await _emailService.SendConfirmation(dto.OrderCode);
    
    return Ok();
}

public class PayOsWebhookDto
{
    public long OrderCode { get; set; }
    public int Amount { get; set; }
    public string Status { get; set; } // "PAID"
    public string TransactionId { get; set; }
}
```

**Config webhook URL trong PayOS dashboard:**
```
https://yourdomain.com/api/payments/webhook
```

---

### 2️⃣ Backend: Verify Payment API

```csharp
[HttpGet("payments/verify/{orderCode}")]
[Authorize]
public async Task<IActionResult> VerifyPayment(long orderCode)
{
    var transaction = await _db.Transactions
        .FirstOrDefaultAsync(t => t.OrderCode == orderCode);
    
    return Ok(new { 
        status = transaction?.Status ?? "NOT_FOUND" 
    });
}
```

---

### 3️⃣ Frontend: Verify sau khi redirect về

```typescript
// File: app/(dashboard)/subscription/page.tsx

useEffect(() => {
  const orderCode = searchParams.get("order")
  
  if (orderCode) {
    // GỌI API ĐỂ VERIFY - ĐỪNG TIN URL PARAMS!
    fetch(`/api/payments/verify/${orderCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "PAID") {
          toast.success("Payment successful!")
        }
      })
  }
}, [searchParams])
```

---

## ⚠️ Lỗi 500 khi thay đổi code?

**Nguyên nhân:** Thay đổi quá nhiều → breaking changes

**Giải pháp:** 
1. ❌ ĐỪNG SỬA code frontend hiện tại
2. ✅ CHỈ THÊM webhook handler ở backend
3. ✅ CHỈ THÊM verify API ở backend
4. ✅ CHỈ THÊM verify call ở subscription page

---

## 🔐 Security Rule

```typescript
// ❌ NGUY HIỂM
if (searchParams.get("success") === "true") {
  activateSubscription() // User có thể fake URL!
}

// ✅ AN TOÀN
const verified = await verifyPaymentAPI(orderCode)
if (verified.status === "PAID") {
  showSuccess()
}
```

---

## 📋 Checklist

- [ ] Backend: Webhook handler
- [ ] Backend: Verify API
- [ ] Frontend: Call verify API
- [ ] Config webhook URL trong PayOS dashboard
- [ ] Test payment end-to-end

---

## 🎯 Kết luận

**3 việc cần làm:**
1. Backend webhook handler
2. Backend verify API  
3. Frontend verify call

**Hết!** Đơn giản vậy thôi. Không cần thay đổi code thanh toán hiện tại.

---

📚 **Chi tiết:** Xem file `PAYOS_USAGE_GUIDE.md`
