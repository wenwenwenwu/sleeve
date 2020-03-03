import {
  Cell
} from "./cell"

class Fence {
  id
  title
  cells = []

  constructor(specs) {
    this.id = specs[0].key_id
    this.title = specs[0].key
    this._initCells(specs)
  }

  _initCells(specs) {
    specs.forEach((spec) => {
      const existed = this.cells.some((cell) => {
        return cell.id === spec.value_id
      })
      if (existed) {
        return
      }
      const cell = new Cell(spec)
      this.cells.push(cell)
    })
  }
}

export {
  Fence
}