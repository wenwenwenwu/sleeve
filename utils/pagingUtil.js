import {
  HttpUtil
} from "../utils/httpUtil.js";

class PagingUtil {
  request
  start
  count
  //外部不调用的标识为内部变量
  _baseUrl
  _isLocked = false
  _accumulator = []
  _hasMore = true

  constructor(request, count = 10, start = 0) {
    this.request = request
    this._baseUrl = request.url
    this.count = count
    this.start = start
  }

  async getPagingData() {
    //加载完成不必请求
    if (!this._hasMore) {
      return
    }
    //避免结果未返回时用户重复发请求
    if (this._isLocked) {
      return
    }
    this._lock()
    const data = await this._actualGetData()
    this._unlock()
    return data
  }

  async _actualGetData() {
    let request = this._getCurrentRequest()
    let pagingData = await HttpUtil.request(request)
    //不用if else逻辑更清晰（判断出来就执行掉了）
    if (!pagingData) {
      return 
    }
    if (pagingData.total === 0) {
      return {
        empty: true,
        items: [],
        hasMore: false,
        accumulator: []
      }
    }
    this._accumulator = this._accumulator.concat(pagingData.items)
    this._hasMore = this._judgeHasMore(pagingData.total_page, pagingData.page)
    const result = {
      empty: false,
      items: pagingData.items,
      hasMore: this._hasMore,
      accumulator: this._accumulator
    }
    if (this._hasMore) {
      this.start += this.count
    }
    return result
  }

  _lock() {
    this._isLocked = true
  }

  _unlock() {
    this._isLocked = false
  }

  _getCurrentRequest() {
    let url = this._baseUrl
    const params = `start=${this.start}&count=${this.count}`
    if (url.includes("?")) {
      url += `&${params}`
    } else {
      url += `?${params}`
    }
    this.request.url = url
    return this.request
  }

  _judgeHasMore(totalPage, pageNum) {
    return pageNum < totalPage - 1
  }

}

export {
  PagingUtil
}