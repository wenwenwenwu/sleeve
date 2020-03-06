import {
  SpecArrayConvertUtil
} from "./spec-array-convert-util"
import {
  Fence
} from "./fence"

class Realm {
  _spu
  skuList
  fences
  defaultSku

  constructor(spu) {
    this._spu = spu
    this.skuList = spu.sku_list
    this._initFence()
    this._initDefaultSku()
  }

  _initFence() {
    const rawSpecArray = this._creatRawSpecsArray()
    const specArrayConvertUtil = new SpecArrayConvertUtil(rawSpecArray)
    const specsArray = specArrayConvertUtil.getSpecArray()
    const fences = []
    specsArray.forEach((specs, index) => {
      const fence = new Fence(index, specs)
      fences.push(fence)
    })
    this.fences = fences
  }

  _initDefaultSku() {
    const defaultSkuID = this._spu.default_sku_id
    if (!defaultSkuID) {
      this.defaultSku = null
      return
    }
    const defaultSku = this.skuList.find((item) => item.id === defaultSkuID)
    this.defaultSku = defaultSku
  }

  _creatRawSpecsArray() {
    const rawSpecArray = []
    this.skuList.forEach(sku => {
      rawSpecArray.push(sku.specs)
    })
    return rawSpecArray
  }

  _enumerateFences(callBack) {
    const fences = this.fences
    for (let row = 0; row < fences.length; row++) {
      for (let line = 0; line < fences[row].cells.length; line++) {
        const cellModel = fences[row].cells[line]
        callBack(cellModel)
      }
    }
  }

}

export {
  Realm
}