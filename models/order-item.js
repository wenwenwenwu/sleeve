import {
  Cart
} from "./cart"
import {
  accMultiply
} from "../utils/number"
import { OrderException } from "../core/orderExceiption"
import { OrderExceptionType } from "../core/enum"

class OrderItem {
  count = 0
  singleFinalPrice
  finalPrice //singleFinalPrice*count
  online
  title
  img
  stock
  categoryId
  rootCategoryId
  spces
  skuId
  cart = new Cart()

  constructor(sku, count) {
    this.title = sku.title
    this.img = sku.img
    this.skuId = sku.skuId
    this.stock = sku.stock
    this.online = sku.online
    this.categoryId = sku.categoryId
    this.rootCategoryId = sku.rootCategoryId
    this.count = count
    this.singleFinalPrice = this.ensureFinalSinglePrice(sku)
    this.finalPrice = accMultiply(this.count, this.singleFinalPrice)
    this.spces = sku.spces
  }

  ensureFinalSinglePrice(sku) {
    if (sku.discount_price) {
      return sku.discount_price
    }
    return sku.price
  }

  isOk(){
    this._checkStock()
    this._beyondMaxSkuCount()
  }

  _checkStock(){
    if(this.stock===0){
      throw new OrderException("当前商品已售罄",OrderExceptionType.SOLD_OUT)
    }
    if(this.count>this.stock){
      throw new OrderException("购买商品数量超过最大库存",OrderExceptionType.BEYOND_STOCK)
    }
  }

  _beyondMaxSkuCount(){
    if(this.stock>Cart.SKU_MAX_COUNT){
      throw new OrderException("超过商品最大购买数量",OrderExceptionType.BEYOND_SKU_MAX_COUNT)
    }
  }
}