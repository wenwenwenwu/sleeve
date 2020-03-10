import {
  SpecArrayConvertUtil
} from "./spec-array-convert-util"
import {
  Fence
} from "./fence"

class Realm {
  spu
  defaultSku
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
  isOutOfStock

  constructor(spu) {
    this.spu = spu
    this._initDefaultSku()
    this._initPreviewImg()
    this._initTitle()
    this._initIsNoSpec()
    this._initPrice()
    this._initDiscountPrice()
    this._initStock()
    this._initIsNoSpec()
    this._initFences()
    // this.isSpecSelectCompleted = false
  }

  _initDefaultSku() {
    const defaultSkuID = this.spu.default_sku_id
    if (!defaultSkuID) {
      this.defaultSku = null
    }
    const defaultSku = this.spu.sku_list.find((item) => item.id === defaultSkuID)
    this.defaultSku = defaultSku
  }

  _initPreviewImg() {
    this.previewImg = this.defaultSku ? this.defaultSku.img : this.spu.img
  }

  _initTitle() {
    this.title = this.defaultSku ? this.defaultSku.title : this.spu.title
  }

  _initPrice() {
    this.price = this.defaultSku ? this.defaultSku.price : this.spu.price
  }

  _initDiscountPrice() {
    this.discountPrice = this.defaultSku ? this.defaultSku.discount_price : this.spu.discount_price
  }

  _initStock() {
    this.stock = this.defaultSku ? this.defaultSku.stock : null
  }

  _initIsNoSpec() {
    const spu = this.spu
    //一个单品一个规格
    if (spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0) {
      this.isNoSpec = true
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
      fences.push(fence)
    })
    this.fences = fences
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