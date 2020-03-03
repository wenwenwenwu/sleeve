// import {
//   CellStatus
// } from "../../core/enum.js"

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
      this.triggerEvent("onTap")
    }
  }
})