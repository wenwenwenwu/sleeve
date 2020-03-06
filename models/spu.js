import {
  PagingUtil
} from "../utils/pagingUtil";
import {
  HttpUtil
} from "../utils/httpUtil";

class Spu {
  static getDetail(id) {
    return HttpUtil.request({
      url: `spu/id/${id}/detail`
    })
  }

  static getPagingUtil() {
    return new PagingUtil({
        url: "spu/latest",
      },
      5
    )
  }

  static isNoSpec(spu){
    if(spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0){
      return true
    } 
    return false
  }
}

export {
  Spu
}