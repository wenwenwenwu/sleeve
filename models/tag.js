import {
  HttpUtil
} from "../utils/httpUtil";

class Tag {
  static getSearchTags() {
    return HttpUtil.request({
      url: `tag/type/1`
    })
  }
}

export {
  Tag
}