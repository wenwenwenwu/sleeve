import { CellStatus } from "../../core/enum"

class Cell {
  row
  line
  keyID
  valueID
  value
  status = CellStatus.SELECTABLE

  constructor(spec, row, line){
    this.row = row
    this.line = line
    this.keyID = spec.key_id
    this.valueID = spec.value_id
    this.value = spec.value
  }
}

export {
  Cell 
}