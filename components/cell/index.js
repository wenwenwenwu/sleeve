import {
  CellStatus
} from "../../core/enum"

// components/cell/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    model: Object,
    status: Object
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
    onTap(event) {
      if (this.properties.status === CellStatus.FORBIDDEN) {
        return
      }
      const model = this.properties.model
      this.triggerEvent("onTap", {
        model
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})