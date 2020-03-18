import {
  getWindowHeightRPX
} from "../../utils/system"
import {
  Categories
} from "../../models/categories"

import {
  SpuListType
} from "../../core/enum"

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
    subsContentArray: [],
    currentIndex: 4
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
    const rootIndex = this.data.category.getRootIndex(rootID)
    this.setData({
      currentIndex: rootIndex
    })
  },

  onJumpToSpuList(event) {
    const cid = event.detail.cid
    const spuListType = SpuListType.SUB_CATEGORY
    console.log(cid)
    wx.navigateTo({
      url: `/pages/spu-list/index?cid=${cid}type=${spuListType}`,
    })
  },

  stopTouchMove(){
    return false
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
    const subsContentArray = category.getSubsContentArray()
    const rootIndex = this.data.category.getRootIndex(this.data.defaultRootID)
    this.setData({
      roots,
      subsContentArray,
      currentIndex: rootIndex
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