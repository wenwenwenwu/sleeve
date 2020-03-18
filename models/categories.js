import {
  HttpUtil
} from "../utils/httpUtil"

class Categories {
  roots = []
  subs = []

  async getAll() {
    const data = await HttpUtil.request({
      url: "category/all"
    })
    this.roots = data.roots
    this.subs = data.subs
  }

  getRoots() {
    return this.roots
  }

  getSubs(parentID) {
    return this.subs.filter(item => item.parent_id == parentID)
  }

  getRoot(rootID) {
    return this.roots.find((result) => result.id === rootID)
  }
}

export {
  Categories
}