import { Cart } from "../../models/cart"

// pages/cart/index.js
Page({

  data: {
    cartItems:[],
    isEmpty: true
  },

  // LifeCycle
  onLoad: function (options) {

  },

  onShow: function () {
    const cart = new Cart()
    const cartItems = cart.getAllCartItemFromLocal().items
    console.log(cartItems)
    if(cart.isEmpty()){
      this.empty()
      return
    }
    this.setData({
      isEmpty: false,
      cartItems
    })
    this.notEmpty()
  },

  // Method
  empty(){
    this.setData({
      isEmpty: true
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },

  notEmpty(){
    
  }

})