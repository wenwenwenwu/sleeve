// pages/home/index.js
import {
  Theme
} from '../../models/theme.js'
import {
  Banner
} from '../../models/banner.js'
import {
  Category
} from '../../models/category.js'
import {
  Activity
} from '../../models/activity.js'
import {
  Spu
} from '../../models/spu.js'

Page({

  data: {
    themeA: null,
    bannerB: null,
    grid: [],
    activityD: null,
    themeE: null,
    themeESPU: [],
    themeF: null,
    bannerG: null,
    themeH: null,
    spuPagingUtil: null,
    hasMore: true
  },

  // LifeCycle
  async onLoad(options) {
    this.initAllData()
    this.initBottomSpuList()

  },

  // Action
  onPullDownRefresh: function () {

  },

  onReachBottom: async function () {
    const data = await this.data.spuPagingUtil.getPagingData()
    if (!data) {
      return
    }
    wx.lin.renderWaterFlow(data.items)
    if(!data.hasMore){
      this.setData({
        hasMore: false
      })
    }
  },

  onShareAppMessage: function () {

  },

  // Method
  async initAllData() {
    const theme = new Theme()
    await theme.getThemes()
    const themeA = theme.getHomeLocationA()
    const themeE = theme.getHomeLocationE()
    const themeF = theme.getHomeLocationF()
    const themeH = theme.getHomeLocationH()

    let themeESPU = []
    if (themeE.online) {
      const data = await Theme.getHomeLocationESPU()
      themeESPU = data.spu_list.slice(0, 8)
    }

    const bannerB = await Banner.getHomeLocationB()
    const grid = await Category.getHomeLocationC()
    const activityD = await Activity.getHomeLocationD()
    const bannerG = await Banner.getHomeLocationG()

    this.setData({
      themeA,
      bannerB,
      grid,
      activityD,
      themeE,
      themeESPU,
      themeF,
      bannerG,
      themeH
    })
  },

  async initBottomSpuList() {
    const spuPagingUtil = Spu.getPagingUtil()
    this.data.spuPagingUtil = spuPagingUtil
    const data = await spuPagingUtil.getPagingData()
    if (!data) {
      return
    }
    wx.lin.renderWaterFlow(data.items)
  }
})