import { CellStatus } from "../../core/enum"

class Cell {
  id
  title
  status = CellStatus.SELECTABLE

  constructor(spec){
    this.id = spec.value_id
    this.title = spec.value
  }
}

export {
  Cell 
}