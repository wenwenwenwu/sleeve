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
}

export {
  Spu
}