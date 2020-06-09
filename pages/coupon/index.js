import {
  Activity
} from "../../models/activity"
import {
  CouponCenterType
} from "../../core/enum"
import {
  Coupon
} from "../../models/coupon"

// pages/coupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const name = options.name
    const type = options.type
    const cid = options.cid
    let coupons
    if (type === CouponCenterType.ACTIVITY) {
      const activity = await Activity.getActivityWithCoupon(name)
      coupons = activity.coupons
    }
    if (type === CouponCenterType.SPU_CATEGORY) {
      coupons = await Coupon.getCouponsByCategory(cid)
      const wholeStoreCoupons = await Coupon.getWholeStoreCoupons()
      coupons = coupons.concat(wholeStoreCoupons)
    }
    this.setData({
      coupons
    })
  }
})