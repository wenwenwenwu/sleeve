import {
  ArrayTransformer
} from "./array-transformer"
import {
  Fence
} from "./fence"

class FenceGroup {
  spu
  skuList

  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
  }

  initFence() {
    const rawSpecArray = this._creatRawSpecsArray()
    const arrayTransformer = new ArrayTransformer(rawSpecArray)
    const specsArray = arrayTransformer.transpose()
    const fences = []
    specsArray.forEach((specs) => {
      const fence = new Fence(specs)
      fences.push(fence)
    })
    console.log(fences)
  }

  _creatRawSpecsArray(){
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