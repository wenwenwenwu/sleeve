import {
  SkuCodeSeparateUtil
} from "./sku-code-separate-util"
import {
  CellStatus
} from "../../core/enum"
import {
  SkuPending
} from "./sku-pending"
import {
  Joiner
} from "../../utils/joiner"

class CellStatusJudgeUtil {
  fenceGroup
  pathDict = []
  skuPending

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
    this._initSkuPending()
  }

  _initSkuPending() {
    this.skuPending = new SkuPending()
  }

  _initPathDict() {
    this.fenceGroup.spu.sku_list.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      this.pathDict = this.pathDict.concat(skuCodeSeparateUtil.possibleCodeArray)
    })
    console.log(this.pathDict)
  }

  judge(model, row, line) {
    this._changeCurrentCellStatus(model, row, line)
    this._miao()
  }

  _changeCurrentCellStatus(model, row, line) {
    if (model.status === CellStatus.SELECTABLE) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTED
      this.skuPending.insertCell(model, row)
    }
    if (model.status === CellStatus.SELECTED) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTABLE
      this.skuPending.removeCell(row)
    }
  }

  _changeOtherCellStatus(cell, x, y) {
    const path = this._findPotentialPath(cell, x, y)
    console.log(path)
    if (!path){
      return
    }
    const isIn = this.pathDict.includes(path)
    if (isIn) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTABLE
    } else {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.FORBIDDEN
    }
  }

  _miao() {
    const fences = this.fenceGroup.fences
    for (let i = 0; i < fences.length; i++) {
      for (let j = 0; j < fences[i].cells.length; j++) {
        const cell = fences[i].cells[j]
        this._changeOtherCellStatus(cell, i, j)
      }
    }
  }

  _findPotentialPath(cell, x, y) {
    const joiner = new Joiner("#", )
    for (let i = 0; i < this.fenceGroup.fences.length; i++) {
      const selected = this.skuPending.findSelectedCellByX(i)
      if (x === i) {
        if(this.skuPending.isSelected(cell,x)){
          return
        }
        //当前行
        const cellCode = this._getCellCode(cell.spec)
        joiner.join(cellCode)
      } else {
        //其他行
        if (selected) {
          const selectedCellCode = this._getCellCode(selected.spec)
          joiner.join(selectedCellCode)
        }
      }
    }
    return joiner.getStr()
  }

  _getCellCode(spec) {
    return `${spec.key_id}-${spec.value_id}`
  }

}

export {
  CellStatusJudgeUtil
}