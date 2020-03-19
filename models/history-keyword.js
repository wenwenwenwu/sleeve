class HistoryKeyword {
  keywords = []
  static MAXITEMCOUNT = 5
  static KEY = "keyword"

  constructor() {
    if (typeof HistoryKeyword.instance === "object") {
      return HistoryKeyword.instance
    }
    this.keywords = this._getLocalKeywords()
    HistoryKeyword.instance = this
    return this
  }

  save(keyword) {
    const items = this.keywords.filter((item) => {
      return item === keyword
    })
    if (items.length !== 0) {
      return
    }
    if (this.keywords.length >= HistoryKeyword.MAXITEMCOUNT) {
      this.keywords.pop() //删除最后一个元素
    }
    this.keywords.unshift(keyword) //首位插入元素
    this._refreshLocal()
  }

  get() {
    return this.keywords
  }

  clear() {
    this.keywords = []
    this._refreshLocal()
  }

  _refreshLocal() {
    wx.setStorageSync(HistoryKeyword.KEY, this.keywords)
  }

  _getLocalKeywords() {
    const keywords = wx.getStorageSync(HistoryKeyword.KEY)
    if (!keywords) {
      wx.setStorageSync(HistoryKeyword.KEY, [])
      return []
    }
    return keywords
  }
}

export {
  HistoryKeyword
}