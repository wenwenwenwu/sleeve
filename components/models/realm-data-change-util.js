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

class RealmDataChangeUtil {
  _defaultSku
  fences
  _selectUtil

  constructor(realm) {
    this.fences = realm.fences
    this.skuList = realm.skuList
    this._defaultSku = realm.defaultSku
    this._initSelectUtil()
  }

  _initSelectUtil() {
    const size = this.fences.length
    if (!this._defaultSku) {
      this._selectUtil = new SelectUtil(size,[])
    } else {
      const selectedCellModels = this._creatSelectedCellModels()
      this._selectUtil = new SelectUtil(size, selectedCellModels)
    }
  }

  get _selectableCodeArray() {
    let selectableCodeArray = []
    this.skuList.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      const itemSelectableCodeArray = skuCodeSeparateUtil.selectableCodeArray
      selectableCodeArray = selectableCodeArray.concat(itemSelectableCodeArray)
    })
    return selectableCodeArray
  }

  get isSpecSelectCompleted() {
    const selectUtil = this._selectUtil
    return selectUtil.isSelectCompleted
  }

  _creatSelectedCellModels() {
    let selectedCellModels = []
    this._defaultSku.specs.forEach((spec) => {
      const tempCell = new Cell(spec)
      this._enumerateFences((cellModel) => {
        if (cellModel.spec === tempCell.spec) {
          selectedCellModels.push(cellModel)
        }
      })
    })
    return selectedCellModels
  }

  defaultChange() {
    this._changeDefaultSelectStatus()
    this._changeSelectableStatus()
  }

  _changeDefaultSelectStatus() {
    this._selectUtil.selectedCellModels.forEach((selectedCellModel) => {
      this._changeItemSelectStatus(selectedCellModel)
    })
  }

  change(cellModel) {
    this._changeItemSelectStatus(cellModel)
    this._changeSelectableStatus()
  }

  _changeItemSelectStatus(cellModel) {
    const status = cellModel.status
    const row = cellModel.row
    const line = cellModel.line
    if (status === CellStatus.SELECTABLE) {
      this.fences[row].cells[line].status = CellStatus.SELECTED
      this._selectUtil.select(cellModel)
    }
    if (status === CellStatus.SELECTED) {
      this.fences[row].cells[line].status = CellStatus.SELECTABLE
      this._selectUtil.unSelect(cellModel)
    }
  }

  _changeSelectableStatus() {
    this._enumerateFences((cellModelItem) => {
      this._changeItemSelectableStatus(cellModelItem)
    })
  }

  _changeItemSelectableStatus(cellModel) {
    //当前cell就是选中cell,不让可选状态覆盖选中状态
    if (this._selectUtil.isSelected(cellModel)) {
      return
    }
    const row = cellModel.row
    const line = cellModel.line
    const specCode = this._creatSpecCode(cellModel) //根据已选中cellModel和当前cellModel确定
    const isSelectable = this._selectableCodeArray.includes(specCode)
    if (isSelectable) {
      this.fences[row].cells[line].status = CellStatus.SELECTABLE
    } else {
      this.fences[row].cells[line].status = CellStatus.FORBIDDEN
    }
  }

  _creatSpecCode(cellModel) {
    const currentRow = cellModel.row
    const joiner = new Joiner("#")
    for (let row = 0; row < this.fences.length; row++) {
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
  RealmDataChangeUtil
}