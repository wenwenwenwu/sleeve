import {
  SpecArrayConvertUtil
} from "./spec-array-convert-util"
import {
  Fence
} from "./fence"

class Realm {
  _spu
  skuList

  constructor(spu) {
    this._spu = spu
    this.skuList = spu.sku_list
  }

  get isNoSpec(){
    const spu = this._spu
    //一个单品一个规格
    if(spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0){
      return true
    } 
    return false
  }

  get fences() {
    const rawSpecArray = this._creatRawSpecsArray()
    const specArrayConvertUtil = new SpecArrayConvertUtil(rawSpecArray)
    const specsArray = specArrayConvertUtil.getSpecArray()
    const fences = []
    specsArray.forEach((specs, index) => {
      const fence = new Fence(index, specs)
      fences.push(fence)
    })
    return fences
  }

  get defaultSku() {
    const defaultSkuID = this._spu.default_sku_id
    if (!defaultSkuID) {
      this.defaultSku = null
      return
    }
    const defaultSku = this.skuList.find((item) => item.id === defaultSkuID)
    return defaultSku
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