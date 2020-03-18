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

  getSubsContentArray() {
    let subsContentArray = []
    this.roots.forEach((item) => {
      const rootID = item.id
      const subsContent = {
        id: rootID,
        subs: this._getSubs(rootID),
        bannerImg: this._getRoot(rootID).img
      }
      subsContentArray.push(subsContent)
    })
    return subsContentArray
  }

  _getSubs(parentID) {
    return this.subs.filter(item => item.parent_id == parentID)
  }

  _getRoot(rootID) {
    return this.roots.find((result) => result.id === rootID)
  }

  getRootIndex(rootID) {
    let rootIndex = 0
    this.roots.forEach((item,index)=>{
      if (item.id == rootID) {
        rootIndex = index
      }
    })
    return rootIndex
  }

}

export {
  Categories
}