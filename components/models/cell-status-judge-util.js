import {
  SkuCodeSeparateUtil
} from "./sku-code-separate-util"
import {
  CellStatus
} from "../../core/enum"
import {
  SelectUtil
} from "./select-util"
import {
  Joiner
} from "../../utils/joiner"

class CellStatusJudgeUtil {
  fenceGroup
  selectableCodeArray = []
  selectUtil

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
    this.selectUtil = new SelectUtil()
  }

  _initPathDict() {
    this.fenceGroup.skuList.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      const selectableCodeArray = skuCodeSeparateUtil.getSelectableCodeArray()
      this.selectableCodeArray = this.selectableCodeArray.concat(selectableCodeArray)
    })
    console.log(this.selectableCodeArray)
  }

  judge(cellModel) {
    this._changeSelectStatus(cellModel)
    this._enumerateFences((cellModelItem)=>{
      this._changeSelectableStatus(cellModelItem)
    })
    return this.fenceGroup.fences
  }

  _changeSelectStatus(cellModel) {
    const status = cellModel.status
    const row = cellModel.row
    const line = cellModel.line
    if (status === CellStatus.SELECTABLE) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTED
      this.selectUtil.select(cellModel)
    }
    if (status === CellStatus.SELECTED) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTABLE
      this.selectUtil.unSelect(cellModel)
    }
  }

  _enumerateFences(callBack) {
    const fences = this.fenceGroup.fences
    for (let row = 0; row < fences.length; row++) {
      for (let line = 0; line < fences[row].cells.length; line++) {
        const cellModel = fences[row].cells[line]
        callBack(cellModel)
      }
    }
  }

  _changeSelectableStatus(cellModel) {
    const row = cellModel.row
    const line = cellModel.line
    const specCode = this._creatSpecCode(cellModel) //根据已选中cellModel和当前cellModel确定
    if (!specCode) { //specCode返回空(即当前选中的cell)不用改变状态
      return
    }
    const isSelectable = this.selectableCodeArray.includes(specCode)
    if (isSelectable) {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.SELECTABLE
    } else {
      this.fenceGroup.fences[row].cells[line].status = CellStatus.FORBIDDEN
    }
  }

  _creatSpecCode(cellModel) {
    const currentRow = cellModel.row
    const joiner = new Joiner("#")
    for (let row = 0; row < this.fenceGroup.fences.length; row++) {
      if (currentRow === row) {
        if (this.selectUtil.isSelected(cellModel)) { //当前cell就是选中cell返回空
          return null
        }
        const cellCode = this._getSpecCode(cellModel)
        joiner.join(cellCode) //拼接当前cell的specCode
      } else {
        const selectedCellModel = this.selectUtil.getRowSelectedCellModel(row)
        if (selectedCellModel) {
          const specCode = this._getSpecCode(selectedCellModel)
          joiner.join(specCode) //拼接已选中的specCode

        }
      }
    }
    return joiner.getStr()
  }

  _getSpecCode(cellModel) {
    return `${cellModel.keyID}-${cellModel.valueID}`
  }

}

export {
  CellStatusJudgeUtil
}