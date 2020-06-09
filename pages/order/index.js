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
import { CouponBO } from "../../models/coupon-bo"

const cart = new Cart()
// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItems:[],
    couponBOList:[]
  },

  // LifeCycle
  onLoad: async function (options) {
    let orderItems
    let localItemCount
    const skuIds = cart.getCheckedSkuIds()
    orderItems = await this.getCartOrderItems(skuIds)
    localItemCount = skuIds.length
    const order = new Order(orderItems, localItemCount)
    try {
      order.checkOrderIsOK()
    } catch (error) {
      console.log(error)
    }
    const coupons = await Coupon.getMySelfWithCategory()
    const couponBOList = this.packageCouponBOList(coupons,order)
    this.setData({
      orderItems,
      couponBOList
    })
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

  packageCouponBOList(coupons,order){
    return coupons.map((coupon)=>{
      const couponBO = new CouponBO(coupon)
      return couponBO
    })
  }
})