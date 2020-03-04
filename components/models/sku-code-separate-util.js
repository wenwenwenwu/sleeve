import {
  combination
} from "../../utils/commonUtil"

class SkuCodeSeparateUtil {
  _code
  _spuAndSpec
  possibleCodeArray = []

  constructor(code) {
    this._code = code //2$1-45#3-9#4-14
    this._spuAndSpec = code.split("$")
    this._initPossibleCodeArray()
  }

  _initPossibleCodeArray() {
    const specCode = this._spuAndSpec[1]
    const specCodeArray = specCode.split("#")
    const length = specCodeArray.length
    for (let i = 1; i <= length; i++) {
      const segments = combination(specCodeArray, i) //返回数组任取i个元素的可能组合
      //例:[[1-45,3-9],[1-45,4-14],[3-9,4-14]]

      const newSegments = segments.map((item) => { //数组子元素数组转字符串
        return item.join("#")
      })
      //例:["1-45#3-9","1-45#4-14","3-9#4-14"]

      this.possibleCodeArray = this.possibleCodeArray.concat(newSegments)
    }
  }


}

export {
  SkuCodeSeparateUtil 
}