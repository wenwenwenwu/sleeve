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

  isEmpty(){
    const cartData = this._getCartData()
    return cartData.items.length === 0
  }

  getCartItemCount(){
    return this._getCartData().items.length
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
    const oldItem = items.find(item => item.skuId == skuId)
    return oldItem
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

}

export {
  Cart
}