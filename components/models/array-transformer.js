class ArrayTransformer {
  /**
   * 原始数组数据结构
   * [货品1,货品2,货品3,货品4]
   * 货品结构
   * [颜色,图案,尺码]
   */
  complexSpecArray

  get goodNum() {
    return this.complexSpecArray.length
  }

  get specNum() {
    return this.complexSpecArray[0].length
  }

  constructor(complexSpecArray) {
    this.complexSpecArray = complexSpecArray
  }

  /**
   * 目标数组数据结构
   * [颜色,图案,尺码]
   * 货品结构
   * [货品1颜色,货品2颜色,货品3颜色,货品4颜色]
   */
  // 目标数组与原数组相当于进行了矩阵转置
  transpose() {
    const desArray = []
    for (let specIndex = 0; specIndex < this.specNum; specIndex++) { //列变行
      desArray[specIndex] = []
      for (let goodIndex = 0; goodIndex < this.goodNum; goodIndex++) {
        desArray[specIndex][goodIndex] = this.complexSpecArray[goodIndex][specIndex]
      }
    }
    return desArray
  }

}

export {
  ArrayTransformer
}