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
  _fenceGroup
  _selectableCodeArray = []
  _selectUtil

  constructor(fenceGroup) {
    this._fenceGroup = fenceGroup
    this._composeSelectableCodeArray()
    this._selectUtil = new SelectUtil()
  }

  _composeSelectableCodeArray() {
    this._fenceGroup.skuList.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      const selectableCodeArray = skuCodeSeparateUtil.getSelectableCodeArray()
      this._selectableCodeArray = this._selectableCodeArray.concat(selectableCodeArray)
    })
    console.log(this._selectableCodeArray)
  }

  judge(cellModel) {
    this._changeSelectStatus(cellModel)
    this._enumerateFences((cellModelItem) => {
      this._changeSelectableStatus(cellModelItem)
    })
    return this._fenceGroup.fences
  }

  _changeSelectStatus(cellModel) {
    const status = cellModel.status
    const row = cellModel.row
    const line = cellModel.line
    if (status === CellStatus.SELECTABLE) {
      this._fenceGroup.fences[row].cells[line].status = CellStatus.SELECTED
      this._selectUtil.select(cellModel)
    }
    if (status === CellStatus.SELECTED) {
      this._fenceGroup.fences[row].cells[line].status = CellStatus.SELECTABLE
      this._selectUtil.unSelect(cellModel)
    }
  }

  _enumerateFences(callBack) {
    const fences = this._fenceGroup.fences
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
    //当前cell就是选中cell,不让已选状态覆盖选中状态
    if (this._selectUtil.isSelected(cellModel)) {
      return
    }
    const isSelectable = this._selectableCodeArray.includes(specCode)
    if (isSelectable) {
      this._fenceGroup.fences[row].cells[line].status = CellStatus.SELECTABLE
    } else {
      this._fenceGroup.fences[row].cells[line].status = CellStatus.FORBIDDEN
    }
  }

  _creatSpecCode(cellModel) {
    const currentRow = cellModel.row
    const joiner = new Joiner("#")
    for (let row = 0; row < this._fenceGroup.fences.length; row++) {
      if (currentRow === row) {
        const cellCode = this._getSpecCode(cellModel)
        joiner.join(cellCode) //拼接当前cell的specCode
      } else {
        const selectedCellModel = this._selectUtil.getRowSelectedCellModel(row)
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