import {
  Cart
} from "../../models/cart"
import {
  Sku
} from "../../models/sku"
import {
  Order
} from "../../models/order"
import {
  Coupon
} from "../../models/coupon"
import {
  OrderItem
} from "../../models/order-item"
import {
  CouponBO
} from "../../models/coupon-bo"
import {
  CouponOperate, ShoppingWay
} from "../../core/enum"
import {
  OrderPost
} from "../../models/order-post"
import { Payment } from "../../models/payment"

import {
  showToast
} from "../../utils/ui.js"

const cart = new Cart()

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    finalTotalPrice: 0,
    discountMoney: 0,
    order: null,
    orderItems: [],
    couponBOList: [],
    currentCouponId: null,
    address: null,
    submitBtnDisable: false,
    orderFail: false,
    orderFailMsg: "",
    shoppingWay: ShoppingWay.CART,
    isOK: true
  },

  // LifeCycle
  onLoad: async function (options) {
    let orderItems
    let localItemCount
    this.data.shoppingWay = options.way
    const skuIds = cart.getCheckedSkuIds()
    orderItems = await this.getCartOrderItems(skuIds)
    localItemCount = skuIds.length
    const order = new Order(orderItems, localItemCount)
    this.data.order = order
    try {
      order.checkOrderIsOK()
    } catch (error) {
      this.setData({
        isOK: false
      })
    }
    const coupons = await Coupon.getMySelfWithCategory()
    const couponBOList = this.packageCouponBOList(coupons, order)
    this.setData({
      totalPrice: order.getTotalPrice(),
      finalTotalPrice: order.getTotalPrice(),
      orderItems,
      couponBOList
    })
  },

  //Action
  onChooseAdddress(event) {
    const address = event.detail.address
    this.data.address = address
  },

  onChooseCoupon(event) {
    const couponObj = event.detail.coupon
    const couponOperate = event.detail.operate
    if (couponOperate === CouponOperate.PICK) {
      this.data.currentCouponId = couponObj.id
      const priceObj = CouponBO.getFinalPrice(this.data.order.getTotalPrice(), couponObj)
      this.setData({
        finalTotalPrice: priceObj.finalPrice,
        discountMoney: priceObj.discountMoney
      })
    } else {
      this.data.currentCouponId = null
      this.setData({
        finalTotalPrice: this.data.order.getTotalPrice(),
        discountMoney: 0
      })
    }
  },

  async onSubmit(event) {
    if (!this.data.address) {
      showToast("请选择收货地址")
      return
    }
    this.disableSubmitBtn()
    const order = this.data.order
    const orderPost = new OrderPost(
      this.data.totalPrice,
      this.data.finalTotalPrice,
      this.data.currentCouponId,
      order.getOrderSkuInfoList(),
      this.data.address
    )
    //第一次请求（向服务端提交订单）
    const oid = await this.postOrder(orderPost)
    if (!oid) {
      this.enableSubmitBtn()
      return
    }
    if (this.data.shoppingWay === ShoppingWay.CART) {
      cart.removeCheckedItems()
    }
    wx.lin.showLoading({
      type: "flash",
      fullScreen: true,
      color: "#157658"
  })
    //第二次请求（向服务端提交oid）
    const payParams = await Payment.getPayParams(oid)
    if (!payParams) {
      return
    }
    //第三次请求（向微信提交数字签名）
    //支付成功
    try {
      const res = await wx.requestPayment(payParams)
      wx.redirectTo({
        url: `/pages/pay-success/index?oid=${oid}`,
      })
    //支付失败
    } catch (error) {
      wx.redirectTo({
        url: `/pages/my-order/index`,

      })
    }
    
    console.log(res)
  },

  // Method
  async getCartOrderItems(skuIds) {
    const skus = await Sku.getSkuByIds(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems
  },

  packageOrderItems(skus) {
    return skus.map(sku => {
      const count = cart.getSkuCountBySkuId(sku.id)
      return new OrderItem(sku, count)
    })
  },

  packageCouponBOList(coupons, order) {
    return coupons.map((coupon) => {
      const couponBO = new CouponBO(coupon)
      couponBO.meetCondition(order)
      return couponBO
    })
  },

  disableSubmitBtn() {
    this.setData({
      submitBtnDisable: true
    })
  },

  enableSubmitBtn() {
    this.setData({
      submitBtnDisable: false
    })
  },

  async postOrder(orderPost) {
    try {
      const res = await Order.postOrderToServer(orderPost)
      if (res) {
        return res.id
      }
    } catch (error) {
      this.setData({
        orderFail: true,
        orderFailMsg: error.message
      })
    }
  }
})