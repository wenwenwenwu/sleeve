import {
  parseSpecValue
} from "../../utils/sku"
import {
  Cart
} from "../../models/cart"

const cart = new Cart()
// components/cart-item/index.js
Component({

  properties: {
    cartItem: Object,
  },

  data: {
    specStr: String,
    discount: Boolean,
    soldOut: Boolean,
    online: Boolean,
    stock: Cart.SKU_MAX_COUNT,
    count: 1,
  },

  observers: {
    cartItem: function (cartItem) {
      if (!cartItem) {
        return
      }
      const specStr = parseSpecValue(cartItem.sku.specs)
      const discount = cartItem.sku.discount_price ? true : false
      const soldOut = Cart.isSoldOut(cartItem)
      const online = Cart.isOnline(cartItem)
      const stock = cartItem.sku.stock
      const count = cartItem.count
      this.setData({
        specStr,
        discount,
        soldOut,
        online,
        stock,
        count
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onDelete(event) {
      const skuId = this.properties.cartItem.skuId
      cart.removeItem(skuId)
      this.setData({
        cartItem: null
      })
      this.triggerEvent("itemDelete", {
        skuId
      })
    },

    onCheckedItem(event) {
      let newChecked = !this.properties.cartItem.checked
      this.properties.cartItem.checked = newChecked
      cart.checkItem(this.properties.cartItem.skuId)
      this.triggerEvent("itemCheck")
    },

    onSelectCount(event){
      let newCount = event.detail.count
      cart.replaceItemCount(this.properties.cartItem.skuId, newCount)
      this.triggerEvent("countFloat")
    }

  }
})