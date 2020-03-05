import {
  Cell
} from "./cell"

class Fence {
  index
  id
  title
  cells = []

  constructor(index, specs) {
    this.index = index
    this.id = specs[0].key_id
    this.title = specs[0].key_id
    this._initCells(specs)
  }

  _initCells(specs) {
    let cellIndex = 0
    specs.forEach((spec) => {
      const existed = this.cells.some((cell) => {
        return cell.valueID === spec.value_id
      })
      if (existed) {
        return
      }
      const cell = new Cell(spec, this.index, cellIndex)
      this.cells.push(cell)
      cellIndex++
    })
  }
}

export {
  Fence
}