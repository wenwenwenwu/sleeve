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
import {
  Cell
} from "./cell"

class CellStatusChangeUtil {
  _fenceGroup
  _selectableCodeArray
  _selectUtil

  constructor(fenceGroup) {
    this._fenceGroup = fenceGroup
    this._initSelectableCodeArray()
    this._initSelectUtil()
    this._initSetting()
  }

  _initSelectableCodeArray() {
    let selectableCodeArray = []
    this._fenceGroup.skuList.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      const itemSelectableCodeArray = skuCodeSeparateUtil.getSelectableCodeArray()
      selectableCodeArray = selectableCodeArray.concat(itemSelectableCodeArray)
    })
    this._selectableCodeArray = selectableCodeArray
  }

  _initSelectUtil() {
    const defaultSku = this._fenceGroup.defaultSku
    if (!defaultSku) {
      this._selectUtil = new SelectUtil()
    } else {
      const selectCellModels = defaultSku.specs.map((item) => new Cell(item))
      this._selectUtil = new SelectUtil(selectCellModels)
    }
  }

  _initSetting() {
    this._changeDefaultSelectStatus()
    this._changeSelectableStatus()
  }

  _changeDefaultSelectStatus() {
    this._selectUtil.selectCellModels.forEach((selectedCellModel) => {
      this._enumerateFences((cellModel) => {
        if (cellModel.id === selectedCellModel.id) {
          cellModel.status = CellStatus.SELECTED
        }
      })
    })
  }

  change(cellModel) {
    this._changeItemSelectStatus(cellModel)
    this._changeSelectableStatus()
    return this._fenceGroup.fences
  }

  _changeItemSelectStatus(cellModel) {
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

  _changeSelectableStatus() {
    this._enumerateFences((cellModelItem) => {
      this._changeItemSelectableStatus(cellModelItem)
    })
  }

  _changeItemSelectableStatus(cellModel) {
    const row = cellModel.row
    const line = cellModel.line
    const specCode = this._creatSpecCode(cellModel) //根据已选中cellModel和当前cellModel确定
    //当前cell就是选中cell,不让可选状态覆盖选中状态
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

  _enumerateFences(callBack) {
    const fences = this._fenceGroup.fences
    for (let row = 0; row < fences.length; row++) {
      for (let line = 0; line < fences[row].cells.length; line++) {
        const cellModel = fences[row].cells[line]
        callBack(cellModel)
      }
    }
  }


  _setCellStatusByID(id, status) {
    this._enumerateFences((cellModel) => {
      if (cellModel.id === id) {
        cellModel.status = status
      }
    })
  }

  _setCellStatusByLocation(row, line, status) {
    this.fences[row].cells[line].status = status
  }

}

export {
  CellStatusChangeUtil
}