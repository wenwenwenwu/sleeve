import { HttpUtil } from "../utils/httpUtil";

class Coupon{
  static async collectCoupon(cid){
    return await HttpUtil.request({
      method:"Post",
      url:`coupon/collect/${cid}`,
      throwError:true
    })
  }
}

export{
  Coupon
}