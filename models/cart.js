import { CartItem } from "./cart-item"
import { Sku } from "./sku"

class Cart {
  static SKU_MIN_COUNT = 1
  static SKU_MAX_COUNT = 77
  static CART_ITEM_MAX_COUNT = 77
  static STORAGE_KEY = 'cart'

  _cartData = null

  //单例构造器
  constructor() {
    if (typeof Cart.instance === 'object') {
      return Cart.instance
    }
    Cart.instance = this
    return this
  }

  static isSoldOut(cartItem){
    return cartItem.sku.store === 0
  }

  static isOnline(cartItem){
    return cartItem.sku.online
  }

  checkItem(skuId){
    const cartItem = this._findEqualItem(skuId)
    cartItem.checked = !cartItem.checked
    this._refreshStorage()
    console.log(this._getCartData().items)
  }

  isAllChecked(){
    let isAllChecked = true
    const items = this._getCartData().items
    for (const item of items) {
      if(!item.checked){
        isAllChecked = false
        break
      }
    }
    return isAllChecked
  }

  checkAll(checked){
    const cartData = this._getCartData()
    cartData.items.forEach(item=>{
      item.checked = checked
    })
    this._refreshStorage()
  }

  addItem(newItem) {
    if (this._beyoundMaxCartItemCount()) {
      throw new Error("超过购物车最大数量")
    }
    this._pushItem(newItem)
    this._refreshStorage()
  }

  removeItem(skuId) {
    const oldItemIndex = this._findEqualItemIndex(skuId)
    const cartData = this._getCartData()
    cartData.items.splice(oldItemIndex, 1)
    this._refreshStorage()
  }

  getAllCartItemFromLocal(){
    return this._getCartData()
  }

  async getAllSkuFromServer(){
    const skuIds = this._getSkuIds()
    const serverData = await Sku.getSkuByIds(skuIds)
    console.log(serverData)
  }

  isEmpty(){
    const cartData = this._getCartData()
    return cartData.items.length === 0
  }

  getCartItemCount(){
    return this._getCartData().items.length
  }

  getCheckedItems(){
    const cartItems = this._getCartData().items
    let checkedCartItems = []
    cartItems.forEach(cartItem => {
      if(cartItem.checked){
        checkedCartItems.push(cartItem)
      }
    });
    return checkedCartItems
  }

  replaceItemCount(skuId,newCount){
    const oldItem = this._findEqualItem(skuId)
    if(!oldItem){
      console.log("异常情况，更新CartItem中的数量不应找不到相应数据")
      return
    }
    if(newCount < 1){
      console.log("异常情况，cartItem中的count不可能小于1")
      return
    }
    oldItem.count = newCount
    if(oldItem.count>=Cart.SKU_MAX_COUNT){
      oldItem.count=Cart.SKU_MAX_COUNT
    }
    this._refreshStorage()
  }

  _beyoundMaxCartItemCount() {
    const cartData = this._getCartData()
    return cartData.items.length >= Cart.CART_ITEM_MAX_COUNT
  }

  _pushItem(newItem) {
    const cartData = this._getCartData()
    const oldItem = this._findEqualItem(newItem.skuId)
    if (oldItem == undefined) {
      cartData.items.unshift(newItem)
    } else {
      this._combineItems(oldItem, newItem.count)
    }
  }

  _getCartData() {
    //内存获取
    if (this._cartData != null) {
      return this._cartData
    }
    //硬盘获取
    let cartData = wx.getStorageSync(Cart.STORAGE_KEY)
    if (!cartData) {
      //新建
      cartData = {
        items: []
      }
      //存入硬盘
      wx.setStorageSync(Cart.STORAGE_KEY, cartData)
    }
    //存入内存
    this._cartData = cartData
    return this._cartData
  }

  _findEqualItem(skuId) {
    const items = this._getCartData().items
    return items.find(item => item.skuId == skuId)
  }

  _combineItems(item, count) {
    item.count += count
    if (item.count >= Cart.SKU_MAX_COUNT) {
      item.count = Cart.SKU_MAX_COUNT
    }
  }

  _refreshStorage() {
    wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
  }

  _findEqualItemIndex(skuId) {
    const cartData = this._getCartData()
    return cartData.items.findIndex(item => item.skuId == skuId)
  }

  _getSkuIds(){
    const cartData = this._getCartData()
    if(cartData.items.length==0){
      return []
    }
    return cartData.items.map(item=>item.skuId)
  }

}

export {
  Cart
}