import {
  HttpUtil
} from "../utils/httpUtil.js";

class Banner {
  static locationB = 'b-1'
  static locationG = 'b-2'

  static getHomeLocationB() {
    return HttpUtil.request({
      url: `banner/name/${Banner.locationB}`
    })
  }

  static getHomeLocationG() {
    return HttpUtil.request({
      url: `banner/name/${Banner.locationG}`
    })
  }
}

export {
  Banner
}