import { HttpUtil } from "../utils/httpUtil";

class Payment {
  static async getPayParams(orderId) {
    const serverParams = await HttpUtil.request({
      url: `payment/pay/order/${orderId}`,
      method: "POST"
    })
    return serverParams
  }
}

export {
  Payment
}