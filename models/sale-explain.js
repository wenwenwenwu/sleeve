import {
  HttpUtil
} from "../utils/httpUtil";

class SaleExplain {
  static async getFixed() {
    const explains = await HttpUtil.request({
      url: "sale_explain/fixed"
    })
    const fixedExplains = explains.map(item => item.text)
    return fixedExplains
  }
}

export {
  SaleExplain
}