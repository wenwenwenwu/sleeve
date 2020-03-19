import {
  HistoryKeyword
} from "../../models/history-keyword"
import {
  Tag
} from "../../models/tag"
import {
  Search
} from "../../models/search"
import { showToast } from "../../utils/ui"


// pages/search/index.js
const history = new HistoryKeyword()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyTags: [],
    search: true
  },

  // LifeCycle
  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTags()
    this.setData({
      historyTags,
      hotTags
    })
  },

  // Action
  async onSearch(event) {
    this.setData({
      search: false,
      items: []
    })
    const keyword = event.detail.value || event.detail.name
    if (!keyword){
      showToast("请输入关键字")
      return
    }
    history.save(keyword)
    const historyTags = history.get()
    this.setData({
      historyTags
    })
    const paging = Search.search(keyword)
    wx.lin.showLoading({
      color:"#157658",
      type:"flash",
      fullScreen:true
    })
    const data = await paging.getPagingData()
    wx.lin.hideLoading()
    if (!data) {
      return
    }
    wx.lin.renderWaterFlow(data.items, true)
  },

  onCancel(event) {
    this.setData({
      search: true,
      items: []
    })
  },

  bindItems(data) {
    if (data.accumulator) {
      this.setData({
        item: data.accumulator
      })
    }
  },

  onClearHistory() {
    history.clear()
    const historyTags = history.get()
    this.setData({
      historyTags
    })
  }
})