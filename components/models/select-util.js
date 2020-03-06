class SelectUtil {
  size
  selectedCellModels //按行储存选中数据

  constructor(size, selectCellModels = []) {
    this.size = size
    this.selectedCellModels = selectCellModels
  }

  select(cellModel) {
    const row = cellModel.row
    this.selectedCellModels[row] = cellModel
  }

  unSelect(cellModel) {
    const row = cellModel.row
    this.selectedCellModels[row] = null
  }

  getRowSelectedCellModel(row) {
    return this.selectedCellModels[row]
  }

  isSelected(cellModel) {
    const row = cellModel.row
    const selectedCellModel = this.getRowSelectedCellModel(row)
    if (!selectedCellModel) {
      return false
    }
    return cellModel.valueID === selectedCellModel.valueID
  }

  isSelectAll() {
    // if (this.size !== this.selectCellModels.length) {
    //   return false
    // }
    for (let i = 0; i < this.size; i++) {
      if (!this.selectedCellModels[i]) {
        return false
      }
    }
    return true
  }
}

export {
  SelectUtil
}