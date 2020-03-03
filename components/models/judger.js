import {
  SkuCodeUtil
} from "./sku-code-util"

class Judger {
  _fenceGroup
  pathDict = []

  constructor(fenceGroup) {
    this._fenceGroup = fenceGroup
    this._initPathDict()
  }

  _initPathDict() {
    this._fenceGroup.spu.sku_list.forEach((sku) => {
      const skuCodeUtil = new SkuCodeUtil(sku.code)
      this.pathDict = this.pathDict.concat(skuCodeUtil.possibleCodeArray)
    })
    console.log(this.pathDict)
  }
}

export {
  Judger
}