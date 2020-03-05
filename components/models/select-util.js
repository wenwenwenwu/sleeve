class SelectUtil {
  selectCellModels = []

  select(cellModel) {
    const row = cellModel.row
    this.selectCellModels[row] = cellModel
  }

  unSelect(cellModel) {
    const row = cellModel.row
    this.selectCellModels[row] = null
  }

  getRowSelectedCellModel(row) {
    return this.selectCellModels[row]
  }

  isSelected(cellModel) {
    const row = cellModel.row
    const selectedCellModel = this.getRowSelectedCellModel(row)
    if (!selectedCellModel) {
      return false
    }
    return cellModel.valueID === selectedCellModel.valueID
  }
}

export {
  SelectUtil
}