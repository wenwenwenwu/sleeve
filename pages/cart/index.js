import {
  Cart
} from "../../models/cart"
import {
  Calculator
} from "../../models/calculator"

const cart = new Cart()

// pages/cart/index.js
Page({

  data: {
    cartItems: [],
    isEmpty: true,
    allChecked: false,
    totalPrice: 0,
    totalSkuCount: 0
  },

  // LifeCycle
  onLoad: function (options) {
    cart.getAllSkuFromServer()
  },

  onShow: function () {
    //设置购物车项、提示红点
    const cart = new Cart()
    const cartItems = cart.getAllCartItemFromLocal().items
    if (cart.isEmpty()) {
      this.empty()
      return
    }
    this.setData({
      isEmpty: false,
      cartItems
    })
    this.notEmpty()
    //设置全选勾
    this.isAllChecked() 
    //设置金额、购买数
    this.refreshCartData()
  },

  //Action
  //变更购买数量
  onCountFloat() {
    this.refreshCartData()
  },

  //变更勾选状态
  onSingleCheck(event) {
    this.isAllChecked()
    this.refreshCartData()
  },

  //删除
  onDeleteItem(event) {
    this.isAllChecked()
    this.refreshCartData()
  },

  onCheckAll(event) {
    const isChecked = event.detail.checked
    cart.checkAll(isChecked)
    this.setData({
      cartItems: this.data.cartItems
    })
    this.refreshCartData()
  },


  // Method
  empty() {
    this.setData({
      isEmpty: true
    })
    wx.hideTabBarRedDot({
      index: 2,
    })
  },

  notEmpty() {
    this.setData({
      isEmpty: false
    })
    wx.showTabBarRedDot({
      index: 2
    })
  },

  isAllChecked() {
    const allChecked = cart.isAllChecked()
    this.setData({
      allChecked
    })
  },

  refreshCartData() {
    const checkedItems = cart.getCheckedItems()
    const caculator = new Calculator(checkedItems)
    caculator.calc()
    const totalPrice = caculator.getTotalPrice()
    const totalSkuCount = caculator.getTotalSkuCount()
    this.setData({
      totalPrice,
      totalSkuCount
    })
  }

})