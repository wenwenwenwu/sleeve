// pages/detail/index.js
import {
  Spu
} from "../../models/spu"
import { ShoppingWay } from "../../core/enum"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu:null,
    showRealm:false,
    orderWay:"cart"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    this.setData({
      spu
    })
  },

  onGoToHome(){
    wx.switchTab({
      url: '/pages/home/index',
    })
  },

  onGoToCart(){
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },

  onAddToCart(){
    this.setData({
      showRealm: true,
      orderWay:ShoppingWay.CART
    })
  },

  onBuy(){
    this.setData({
      showRealm: true,
      orderWay: ShoppingWay.BUY
    })
  }
})