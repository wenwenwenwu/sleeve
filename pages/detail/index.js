// pages/detail/index.js
import {
  Spu
} from "../../models/spu"
import { ShoppingWay } from "../../core/enum"
import { SaleExplain } from "../../models/sale-explain"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu:null,
    showRealm:false,
    orderWay:"cart",
    realm:null,
    explain: Array
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    const explain = await SaleExplain.getFixed()
    this.setData({
      spu,
      explain
    })
  },

  onGoToHome(){
    console.log("gou")
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
  },

  onSpecChangae(event){
    const realm = event.detail.realm
    this.setData({
      realm
    })
  }
})