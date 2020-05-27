// components/check-box/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: Boolean
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
    onChecked(event) {
      let newChecked = !this.properties.checked
      this.setData({
        checked: newChecked
      })
      this.triggerEvent('checked', {
        checked: newChecked
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})