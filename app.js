import { Cart } from "./models/cart"

//app.js
App({

  onLaunch(){
    const cart = new Cart()
    if (!cart.isEmpty){
      wx.showTabBarRedDot({
        index: 2,
      })
    }
  }

})