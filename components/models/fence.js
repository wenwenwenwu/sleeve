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
    this.title = specs[0].key
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


  setFenceSketch(skuList) {
    this.cells.forEach((item) => {
      this._setCellSkuImg(item, skuList)
    })
  }

  _setCellSkuImg(cell, skuList) {
    const code = cell.code
    const matchedSku = skuList.find(item => item.code.includes(code))
    if (matchedSku) {
      cell.skuImg = matchedSku.img
    }
  }
}

export {
  Fence
}