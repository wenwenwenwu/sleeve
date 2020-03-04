import {
  SkuCodeSeparateUtil
} from "./sku-code-separate-util"
import {
  CellStatus
} from "../../core/enum"

class CellStatusJudgeUtil {
  fenceGroup
  pathDict = []

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
  }

  _initPathDict() {
    this.fenceGroup.spu.sku_list.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      this.pathDict = this.pathDict.concat(skuCodeSeparateUtil.possibleCodeArray)
    })
    console.log(this.pathDict)
  }

  judge(model, row, line) {
    if (model.status === CellStatus.WAITING) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTED
    }
    if (model.status === CellStatus.SELECTED) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.WAITING
    }
  }

}

export {
  CellStatusJudgeUtil
}