import { CellStatus } from "../../core/enum"

class Cell {
  id
  title
  status = CellStatus.WAITING

  constructor(spec){
    this.id = spec.value_id
    this.title = spec.value
  }
}

export {
  Cell 
}