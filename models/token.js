import {
  config
} from "../config/config"
import { promisic } from "../miniprogram_npm/lin-ui/utils/util"

class Token {

  constructor() {
    this.tokenUrl = config.apiBasicUrl + "token"
    this.verifyUrl = config.apiBasicUrl + "token/verify"
  }

  async verify() {
    const token = wx.getStorageSync('token')
    if (!token) {
      await this.getTokenFromServer()
    } else {
      await this._verifyFromServer(token)
    }
  }

  async getTokenFromServer(){
    const loginRes = await wx.login()
    const code = loginRes.code

    const tokenRes = await promisic(wx.request)({
      url: this.tokenUrl,
      method: "POST",
      data:{
        account: code,
        type:0
      }
    })
    console.log(tokenRes.data.token)
    wx.setStorageSync('token', tokenRes.data.token)
    return tokenRes.data.token
  }

}

export{
  Token
}