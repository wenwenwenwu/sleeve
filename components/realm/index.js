import {
  Realm
} from "../models/realm"
import {
  CellStatusChangeUtil
} from "../models/cell-status-change-util"
import {
  Spu
} from "../../models/spu"

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
    discountPrice: String,
    isNoSpec:Boolean,
    isSelectAll: Boolean
  },

  observers: {
    "spu": function (spu) {
      if (!spu) {
        return
      }
      if (Spu.isNoSpec(spu)) {
        this.setData({
          isNoSpec: true,
        })
        this.bindSpuData(spu.sku_list[0])
        return
      }
      const realm = new Realm(spu)
      this.data.cellStatusChangeUtil = new CellStatusChangeUtil(realm)
      this.bindInitData(realm)

      const defaultSku = realm.defaultSku
      if (defaultSku) {
        this.bindSkuData(defaultSku)
      } else {
        this.bindSpuData()
      }
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
        discountPrice: spu.discount_price,

      })
    },

    bindSkuData(sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price,
        stock: sku.stock
      })
    },

    bindInitData(realm) {
      this.setData({
        fences: realm.fences,
        isSelectAll: this.data.cellStatusChangeUtil.selectUtil.isSelectAll()
      })
    },

    onCellTap(event) {
      const model = event.detail.model
      const cellStatusChangeUtil = this.data.cellStatusChangeUtil
      const fences = cellStatusChangeUtil.change(model)
      this.setData({
        fences: cellStatusChangeUtil._fenceGroup.fences
      })
    },

  }
})