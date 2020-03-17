import {
  getWindowHeightRPX
} from "../../utils/system"

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    segmentHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const windowHeightRPX = await getWindowHeightRPX()
    this.setData({
      segmentHeight: windowHeightRPX - 60 - 20 - 2
    })
  },

  onGoToSearch(event) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  }
})