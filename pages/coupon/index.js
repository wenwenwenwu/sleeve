import {
  Activity
} from "../../models/activity"

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
    let coupons
    const activity = await Activity.getActivityWithCoupon(name)
    coupons = activity.coupons
    this.setData({
      coupons
    })
  }

})