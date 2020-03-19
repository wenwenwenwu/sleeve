
import {
  PagingUtil
} from "../utils/pagingUtil"

class Search {
  static search(keyword) {
    return new PagingUtil({
      url: `search?q=${keyword}`
    })
  }
}

export {
  Search
}