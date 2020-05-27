// pages/detail/index.js
import {
  Spu
} from "../../models/spu"
import {
  ShoppingWay
} from "../../core/enum"
import {
  SaleExplain
} from "../../models/sale-explain"
import {
  px2rpx
} from "../../miniprogram_npm/lin-ui/utils/util"
import {
  getSystemSize, getWindowHeightRPX
} from "../../utils/system"
import { Cart } from "../../models/cart"
import { CartItem } from "../../models/cart-item"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu: null,
    showRealm: false,
    orderWay: "cart",
    realm: null,
    explain: [],
    scrollHeight: 0,
    cartItemCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    const explain = await SaleExplain.getFixed()
    const windowHeightRPX = await getWindowHeightRPX()
    const scrollHeight = windowHeightRPX - 100
    this.setData({
      spu,
      explain,
      scrollHeight
    })
    this.updateTabbarCartItemCount()
  },

  onGoToHome() {
    console.log("gou")
    wx.switchTab({
      url: '/pages/home/index',
    })
  },

  onGoToCart() {
    wx.switchTab({
      url: '/pages/cart/index',
    })
  },

  onAddToCart() {
    this.setData({
      showRealm: true,
      orderWay: ShoppingWay.CART
    })
  },

  onBuy() {
    this.setData({
      showRealm: true,
      orderWay: ShoppingWay.BUY
    })
  },

  onSpecChangae(event) {
    const realm = event.detail.realm
    this.setData({
      realm
    })
  },

  onShopping(event){
    const chosenSku = event.detail.sku
    const skuCount = event.detail.skuCount
    if(event.detail.orderWay === ShoppingWay.CART){
      const cart = new Cart()
      const cartItem = new CartItem(chosenSku,skuCount)
      cart.addItem(cartItem)
      this.updateTabbarCartItemCount()
    }
  },

  // Method
  updateTabbarCartItemCount(){
    const cart = new Cart()
    this.setData({
      cartItemCount: cart.getCartItemCount(),
      showRealm: false
    })
  }
})