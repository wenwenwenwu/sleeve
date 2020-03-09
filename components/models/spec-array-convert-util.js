class SpecArrayConvertUtil {
  /**
   * 原始数组数据结构
   * [货品1,货品2,货品3,货品4]
   * 货品结构
   * [颜色,图案,尺码]
   */
  _rawSpecArray

  get goodNum() {
    return this._rawSpecArray.length
  }

  get specNum() {
    return this._rawSpecArray[0].length
  }

  constructor(rawSpecArray) {
    this._rawSpecArray = rawSpecArray
  }

  /**
   * 目标数组数据结构
   * [颜色,图案,尺码]
   * 货品结构
   * [货品1颜色,货品2颜色,货品3颜色,货品4颜色]
   */
  // 目标数组与原数组相当于进行了矩阵转置
  get specArray() {
    const desArray = []
    for (let specIndex = 0; specIndex < this.specNum; specIndex++) { //列变行
      desArray[specIndex] = []
      for (let goodIndex = 0; goodIndex < this.goodNum; goodIndex++) {
        desArray[specIndex][goodIndex] = this._rawSpecArray[goodIndex][specIndex]
      }
    }
    return desArray
  }

}

export {
  SpecArrayConvertUtil
}