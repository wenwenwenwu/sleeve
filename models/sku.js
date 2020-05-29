import {
  HttpUtil
} from "../utils/httpUtil";

class Sku {
  static async getSkuByIds(ids) {
    return await HttpUtil.request({
      url: `sku?ids=${ids}`
    })
  }
}

export {
  Sku
}