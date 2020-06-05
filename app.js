import { Cart } from "./models/cart"
import { Token } from "./models/token"

//app.js
App({

  onLaunch(){
    const cart = new Cart()
    if (!cart.isEmpty){
      wx.showTabBarRedDot({
        index: 2,
      })
    }

    const token = new Token()
    token.verify()
  }

})