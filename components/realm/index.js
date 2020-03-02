import { FenceGroup } from "../models/fence-group"

// components/realm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  observers: {
    "spu": (spu) => {
      if (!spu) {
        return
      }
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFence()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})