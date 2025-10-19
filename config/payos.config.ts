import { usePayOS, PayOSConfig } from "payos-checkout";

export const payOSConfig: PayOSConfig = {
  RETURN_URL: process.env.RETURN_URL ?? "",
  ELEMENT_ID: process.env.ELEMENT_ID ?? "",
  CHECKOUT_URL: process.env.CHECKOUT_URL ?? "",
  embedded: true, // Nếu dùng giao diện nhúng
  onSuccess: (event: any) => {
    //TODO: Hành động sau khi người dùng thanh toán đơn hàng thành công
  },
  onCancel: (event: any) => {
    //TODO: Hành động sau khi người dùng Hủy đơn hàng
  },
  onExit: (event: any) => {
    //TODO: Hành động sau khi người dùng tắt Pop up
  },
};