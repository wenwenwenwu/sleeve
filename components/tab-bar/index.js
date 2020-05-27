// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartItemCount:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGoToHome(event) {
      this.triggerEvent("onGoToHome")
    },

    onGoToCart(event) {
      this.triggerEvent("onGoToCart")
    },
    onAddToCart(event) {
      this.triggerEvent("onAddToCart")
    },
    onBuy(event) {
      this.triggerEvent("onBuy")
    },
  }
})