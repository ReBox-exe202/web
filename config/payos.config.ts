import { usePayOS, PayOSConfig } from "payos-checkout";

const payOSConfig: PayOSConfig = {
  RETURN_URL: "", // required
  ELEMENT_ID: "", // required
  CHECKOUT_URL: "", // required
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