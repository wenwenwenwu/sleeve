import {
  getWindowHeightRPX
} from "../../utils/system"
import {
  Categories
} from "../../models/categories"

// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    segmentHeight: 0,
    category: null,
    defaultRootID: 2,
    roots: [],
    currentSubs: [],
    currentBannerImg: ""
  },

  // LifeCycle
  onLoad: async function (options) {
    this.setDynamicSegmentHeight()
    this.initCategoryData()
  },


  // Action
  onGoToSearch(event) {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },

  onSegChange(event) {
    const rootID = event.detail.activeKey
    console.log(rootID)
    const currentSubs = this.data.category.getSubs(rootID)
    console.log(currentSubs)
    const currentRoot = this.data.category.getRoots(rootID)
    console.log(currentRoot)
    this.setData({
      currentSubs,
      currentBannerImg: currentRoot.img
    })
  },

  // Method
  async setDynamicSegmentHeight() {
    const windowHeightRPX = await getWindowHeightRPX()
    this.setData({
      segmentHeight: windowHeightRPX - 60 - 20 - 2
    })
  },

  async initCategoryData() {
    const category = new Categories()
    this.data.category = category
    await category.getAll()
    const roots = category.getRoots()
    const defaultRoot = this.getDefaultRoot(roots)
    const currentSubs = category.getSubs(defaultRoot.id)
    this.setData({
      roots,
      currentSubs,
      currentBannerImg: defaultRoot.img
    })
  },

  getDefaultRoot(roots) {
    let defaultRoot = roots.find((result => result.id === this.data.defaultRootID))
    if (!defaultRoot) {
      return roots[0]
    }
    return defaultRoot
  },

})