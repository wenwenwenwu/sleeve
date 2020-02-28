import {
  PagingUtil
} from "../utils/pagingUtil";

class Spu {
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