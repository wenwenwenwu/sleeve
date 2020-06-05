import { Cart } from "../../models/cart"
import { Sku } from "../../models/sku"
import { Order } from "../../models/order"

const cart = new Cart()
// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  // LifeCycle
  onLoad: function (options) {
    let orderItems
    let localItemCount
    const skuIds = cart.getCheckedSkuIds()
    orderItems = this.getCartOrderItems(skuIds)
    localItemCount = skuIds.count
    const order = new Order(orderItem,localItemCount)
    try {
      order.checkOrderIsOK()
    } catch (error) {
      console.log(error)
    }
  },

  // Method
  async getCartOrderItems(skuIds){
    const skus = await Sku.getSkuByIds(skuIds)
    const orderItems = this.packageOrderItems(skus)
    return orderItems
  },

  packageOrderItems(skus){
    skus.map(sku=>{
      const count = cart.getSkuCountBySkuId(sku.id)
      return new orderItem(sku,count)
    })
  }
})