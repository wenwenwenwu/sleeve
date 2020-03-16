import {
  SpecArrayConvertUtil
} from "./spec-array-convert-util"
import {
  Fence
} from "./fence"
import {
  Cart
} from "../../models/cart"

class Realm {
  spu
  previewImg
  title
  price
  discountPrice
  stock
  selectedSpecValues
  missSpecKeys
  isNoSpec
  fences
  isSpecSelectCompleted
  shoppingCount
  isOutOfStock

  constructor(spu) {
    this.spu = spu
    this.isSpecSelectCompleted = false
    this._initPreviewImg()
    this._initTitle()
    this._initPrice()
    this._initDiscountPrice()
    this._initStock()
    this._initIsNoSpec()
    this._initFences()
    this.shoppingCount = Cart.SKU_MIN_COUNT
    this.isOutOfStock = false
  }

  _initPreviewImg() {
    this.previewImg = this.spu.img
  }

  _initTitle() {
    this.title = this.spu.title
  }

  _initPrice() {
    this.price = this.spu.price
  }

  _initDiscountPrice() {
    this.discountPrice = this.spu.discount_price
  }

  _initStock() {
    this.stock = this.spu.sku_list[0].stock
  }

  _initIsNoSpec() {
    const spu = this.spu
    //一个单品一个规格
    if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
      this.isNoSpec = true
      return
    }
    this.isNoSpec = false
  }

  _initFences() {
    const rawSpecArray = this._rawSpecsArray
    const specArrayConvertUtil = new SpecArrayConvertUtil(rawSpecArray)
    const specsArray = specArrayConvertUtil.specArray
    const fences = []
    specsArray.forEach((specs, index) => {
      const fence = new Fence(index, specs)
      if (this.spu.sketch_spec_id && this.spu.sketch_spec_id === fence.id) {
        fence.setFenceSketch(this.spu.sku_list)
      }
      fences.push(fence)
    })
    this.fences = fences
    console.log(this.fences)
  }

  get _rawSpecsArray() {
    const rawSpecArray = []
    this.spu.sku_list.forEach(sku => {
      rawSpecArray.push(sku.specs)
    })
    return rawSpecArray
  }
}

export {
  Realm
}