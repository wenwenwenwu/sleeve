import {
  HttpUtil
} from "../utils/httpUtil";

class Coupon {
  static async collectCoupon(cid) {
    return await HttpUtil.request({
      method: "Post",
      url: `coupon/collect/${cid}`,
      throwError: true
    })
  }

  static async getCouponsByCategory(cid) {
    return await HttpUtil.request({
        url: `coupon/by/category/${cid}`,
    })
}

  static async getTop2CouponsByCategory(cid) {
    let coupons = await HttpUtil.request({
      url: `coupon/by/category/${cid}`,
    })
    if (coupons.length === 0) {
      const otherCoupons = await Coupon.getWholeStoreCoupons()
      return Coupon.getTop2(otherCoupons)
    }
    if (coupons.length >= 2) {
      return coupons.slice(0, 2)
    }
    if (coupons.length === 1) {
      const otherCoupons = await Coupon.getWholeStoreCoupons()
      coupons = coupons.concat(otherCoupons)
      return Coupon.getTop2(coupons)
    }
  }

  static getTop2(coupons) {
    if (coupons.length === 0) {
      return []
    }
    if (coupons.length >= 2) {
      return coupons.slice(0, 2)
    }
    if (coupons.length === 1) {
      return coupons
    }
    return []
  }

  static async getWholeStoreCoupons() {
    return HttpUtil.request({
        url: `coupon/whole_store`
    })
}
}

export {
  Coupon
}