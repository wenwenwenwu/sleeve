import {
  FenceGroup
} from "../models/fence-group"
import {
  CellStatusChangeUtil
} from "../models/cell-status-change-util"

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
    cellStatusChangeUtil: Object,
    previewImg: String,
    title: String,
    price: String,
    discountPrice: String
  },

  observers: {
    "spu": function (spu) {
      if (!spu) {
        return
      }
      const fenceGroup = new FenceGroup(spu)
      this.data.cellStatusChangeUtil = new CellStatusChangeUtil(fenceGroup)
      const defaultSku = fenceGroup.defaultSku
      if (defaultSku) {
        this.bindSkuData(defaultSku)
      } else {
        this.bindSpuData()
      }
      this.bindInitData(fenceGroup)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindSpuData() {
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price
      })
    },

    bindSkuData(sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price
      })
    },

    bindInitData(fenceGroup) {
      this.setData({
        fences: fenceGroup.fences
      })
    },

    onCellTap(event) {
      const model = event.detail.model
      const cellStatusChangeUtil = this.data.cellStatusChangeUtil
      const fences = cellStatusChangeUtil.change(model)
      this.setData({
        fences
      })
    },

  }
})