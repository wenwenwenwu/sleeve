import {
  FenceGroup
} from "../models/fence-group"
import {
  CellStatusJudgeUtil
} from "../models/cell-status-judge-util"

// components/realm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    fences: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    cellStatusJudgeUtil: Object
  },

  observers: {
    "spu": function (spu) {
      if (!spu) {
        return
      }
      const fenceGroup = new FenceGroup(spu)
      this.data.cellStatusJudgeUtil = new CellStatusJudgeUtil(fenceGroup)
      this.bindInitData(fenceGroup)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindInitData(fenceGroup) {
      this.setData({
        fences: fenceGroup.fences
      })
      console.log(this.data.fences)
    },

    onCellTap(event) {
      const model = event.detail.model
      const cellStatusJudgeUtil = this.data.cellStatusJudgeUtil
      cellStatusJudgeUtil.judge(model)
      this.setData({
        fences: cellStatusJudgeUtil.fenceGroup.fences
      })
    },

  }
})