import {
  HttpUtil
} from "../utils/httpUtil.js";

class Category {
  static getHomeLocationC() {
    return HttpUtil.request({
      url: 'category/grid/all'
    })
  }
}

export {
  Category
}