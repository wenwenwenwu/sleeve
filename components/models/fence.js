import {
  Cell
} from "./cell"

class Fence {
  cells = []

  constructor(specs) {
    specs.forEach((spec) => {
      const cell = new Cell(spec)
      this.cells.push(cell)
    })
  }
}

export {
  Fence
}