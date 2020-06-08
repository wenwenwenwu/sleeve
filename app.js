import {
  Cart
} from "./models/cart"
import {
  Token
} from "./models/token"

//app.js
App({

  onLaunch() {
    const cart = new Cart()
    if (!cart.isEmpty) {
      wx.showTabBarRedDot({
        index: 2,
      })
    }
    //并不是onLaunch中所有代码都走完了才执行网络请求
    //验证可用的token使用时也有可能过期
    const token = new Token()
    token.verify()
  }

})