import {
  CellStatus
} from "../../core/enum"

class Cell {
  spec
  row
  line
  keyID
  valueID
  value
  status = CellStatus.SELECTABLE
  code

  constructor(spec, row, line) {
    this.spec = spec
    this.row = row
    this.line = line
    this.keyID = spec.key_id
    this.valueID = spec.value_id
    this.value = spec.value
    this._initCode()
  }

  _initCode() {
    this.code = `${this.keyID}-${this.valueID}`
  }
}

export {
  Cell
}