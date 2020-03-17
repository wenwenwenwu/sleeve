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

  // LifeCycle
  onLoad: async function (options) {
     this.setDynamicSegmentHeight()
  },


  // Action
  onGoToSearch(event) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },

  async setDynamicSegmentHeight() {
    const windowHeightRPX = await getWindowHeightRPX()
    this.setData({
      segmentHeight: windowHeightRPX - 60 - 20 - 2
    })
  }
})