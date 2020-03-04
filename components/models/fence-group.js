import {
  SpecArrayConvertUtil
} from "./spec-array-convert-util"
import {
  Fence
} from "./fence"

class FenceGroup {
  spu
  skuList
  fences

  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
    this._initFence()
  }

  _initFence() {
    const rawSpecArray = this._creatRawSpecsArray()
    const specArrayConvertUtil = new SpecArrayConvertUtil(rawSpecArray)
    const specsArray = specArrayConvertUtil.transpose()
    const fences = []
    specsArray.forEach((specs) => {
      const fence = new Fence(specs)
      fences.push(fence)
    })
    this.fences = fences
  }

  _creatRawSpecsArray() {
    const rawSpecArray = []
    this.skuList.forEach(sku => {
      rawSpecArray.push(sku.specs)
    })
    return rawSpecArray
  }

}

export {
  FenceGroup
}