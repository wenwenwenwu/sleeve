import { Cart } from "../../models/cart"
import { Sku } from "../../models/sku"

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
    const skuIds = cart.getCheckedSkuIds()
    orderItems = this.getCartOrderItems(skuIds)
    
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