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
  realm
  _defaultSku
  // fences
  _pid
  _skuList
  _selectUtil

  constructor(realm) {
    this.realm = realm
    this._pid = realm.pid
    this._skuList = realm.skuList
    this._defaultSku = realm.defaultSku
    this._initSelectUtil()
  }

  _initSelectUtil() {
    const size = this.realm.fences.length
    if (!this._defaultSku) {
      this._selectUtil = new SelectUtil(size, [])
    } else {
      const selectedCellModels = this._creatSelectedCellModels()
      this._selectUtil = new SelectUtil(size, selectedCellModels)
    }
  }

  get _selectableCodeArray() {
    let selectableCodeArray = []
    this._skuList.forEach((sku) => {
      const skuCodeSeparateUtil = new SkuCodeSeparateUtil(sku.code)
      const itemSelectableCodeArray = skuCodeSeparateUtil.selectableCodeArray
      selectableCodeArray = selectableCodeArray.concat(itemSelectableCodeArray)
    })
    return selectableCodeArray
  }

  _changeSpecSelectCompletedStatus() {
    const selectUtil = this._selectUtil
    this.realm.isSpecSelectCompleted = selectUtil.isSelectCompleted
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
    this._changeSpecSelectCompletedStatus()

  }

  _changeDefaultSelectStatus() {
    this._selectUtil.selectedCellModels.forEach((selectedCellModel) => {
      this._changeItemSelectStatus(selectedCellModel)
    })
  }

  change(cellModel) {
    this._changeItemSelectStatus(cellModel)
    this._changeSelectableStatus()
    this._changeSpecSelectCompletedStatus()
    this._changeGood()
  }

  _changeItemSelectStatus(cellModel) {
    const status = cellModel.status
    const row = cellModel.row
    const line = cellModel.line
    if (status === CellStatus.SELECTABLE) {
      this.realm.fences[row].cells[line].status = CellStatus.SELECTED
      this._selectUtil.select(cellModel)
    }
    if (status === CellStatus.SELECTED) {
      this.realm.fences[row].cells[line].status = CellStatus.SELECTABLE
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
    if (this._selectUtil.getSelectStatus(cellModel)) {
      return
    }
    const row = cellModel.row
    const line = cellModel.line
    const specCode = this._creatSpecCode(cellModel) //根据已选中cellModel和当前cellModel确定
    const isSelectable = this._selectableCodeArray.includes(specCode)
    if (isSelectable) {
      this.realm.fences[row].cells[line].status = CellStatus.SELECTABLE
    } else {
      this.realm.fences[row].cells[line].status = CellStatus.FORBIDDEN
    }
  }

  _changeGood() {
    const selectUtil = this._selectUtil
    const code = `${this._pid}$${selectUtil.skuCode}`
    const sku = this._skuList.find(item => item.code === code)
    if (!sku) {
      return
    }
    this.realm.title = sku.title
    this.realm.previewImg = sku.img
    this.realm.price = sku.price
    this.realm.discountPrice = sku.discount_price
    this.realm.stock = sku.stock
  }

  _creatSpecCode(cellModel) {
    const currentRow = cellModel.row
    const joiner = new Joiner("#")
    for (let row = 0; row < this.realm.fences.length; row++) {
      if (currentRow === row) {
        const cellCode = cellModel.code
        joiner.join(cellCode) //拼接当前cell的specCode
      } else {
        const selectedCellModel = this._selectUtil.getRowSelectedCellModel(row)
        if (selectedCellModel) {
          const specCode = selectedCellModel.code
          joiner.join(specCode) //拼接已选中的specCode

        }
      }
    }
    return joiner.getStr()
  }

  _enumerateFences(callBack) {
    const fences = this.realm.fences
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