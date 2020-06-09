// pages/detail/index.js
import {
  Spu
} from "../../models/spu"
import {
  ShoppingWay, CouponCenterType
} from "../../core/enum"
import {
  SaleExplain
} from "../../models/sale-explain"
import {
  px2rpx
} from "../../miniprogram_npm/lin-ui/utils/util"
import {
  getSystemSize,
  getWindowHeightRPX
} from "../../utils/system"
import {
  Cart
} from "../../models/cart"
import {
  CartItem
} from "../../models/cart-item"
import {
  Coupon
} from "../../models/coupon"
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
    cartItemCount: 0,
    coupons:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    const coupons = await Coupon.getTop2CouponsByCategory(spu.category_id)
    const explain = await SaleExplain.getFixed()
    const windowHeightRPX = await getWindowHeightRPX()
    const scrollHeight = windowHeightRPX - 100
    this.setData({
      spu,
      explain,
      scrollHeight,
      coupons
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

  onShopping(event) {
    const chosenSku = event.detail.sku
    const skuCount = event.detail.skuCount
    if (event.detail.orderWay === ShoppingWay.CART) {
      const cart = new Cart()
      const cartItem = new CartItem(chosenSku, skuCount)
      cart.addItem(cartItem)
      this.updateTabbarCartItemCount()
    }
  },

  onGoToCouponCenter(event){
    const type = CouponCenterType.SPU_CATEGORY
    const cid = this.data.spu.category_id
    wx.navigateTo({
      url: `/pages/coupon/index?cid=${cid}&type=${type}`,
    })
  },

  // Method
  updateTabbarCartItemCount() {
    const cart = new Cart()
    this.setData({
      cartItemCount: cart.getCartItemCount(),
      showRealm: false
    })
  }
})