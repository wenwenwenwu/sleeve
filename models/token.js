import {
  config
} from "../config/config"
import {
  promisic
} from "../miniprogram_npm/lin-ui/utils/util"

class Token {

  constructor() {
    this.tokenUrl = config.apiBaseUrl + "token"
    this.verifyUrl = config.apiBaseUrl + "token/verify"
  }

  //只是验证，token不存在或者过期的话重新获取并保存本地，无需返回token值
  async verify() {
    const token = wx.getStorageSync('token')
    if (!token) {
      await this.getTokenFromServer()
    } else {
      await this._verifyFromServer(token)
    }
  }

  async getTokenFromServer() {
    const codeRes = await wx.login()
    const code = codeRes.code
    //wx.login等方法已经可以直接返回promise，前提是不用callback形式写
    //但是wx.request方法依旧不行，需要使用promisic方法
    const tokenRes = await promisic(wx.request)({
      url: this.tokenUrl,
      method: 'POST',
      data: {
        account: code,
        type: 0
      },
    })
    wx.setStorageSync('token', tokenRes.data.token)
  }

  async _verifyFromServer(token) {
    const res = await promisic(wx.request)({
      url: this.verifyUrl,
      method: 'POST',
      data: {
        token
      }
    })
    const valid = res.data.is_valid
    if (!valid) {
      return this.getTokenFromServer()
    }
  }
}

export {
  Token
}