import {
  Realm
} from "../models/realm"
import {
  RealmDataChangeUtil
} from "../models/realm-data-change-util.js"
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
    realmDataChangeUtil: Object,
    previewImg: String,
    title: String,
    price: String,
    discountPrice: String,
    isNoSpec:Boolean,
    isSpecSelectCompleted: Boolean
  },

  observers: {
    "spu": function (spu) {
      if (!spu) {
        return
      }
      const realm = new Realm(spu)
      if (realm.isNoSpec) {
        this.setData({
          isNoSpec: true,
        })
        this.bindSpuData(spu.sku_list[0])
        return
      }
      this.data.realmDataChangeUtil = new RealmDataChangeUtil(realm)
      this.data.realmDataChangeUtil.defaultChange()
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
      const realmDataChangeUtil = this.data.realmDataChangeUtil
      this.setData({
        fences: realmDataChangeUtil.fences,
        isSpecSelectCompleted: realmDataChangeUtil.isSpecSelectCompleted
      })
    },

    onCellTap(event) {
      const model = event.detail.model
      const realmDataChangeUtil = this.data.realmDataChangeUtil
      realmDataChangeUtil.change(model)
      this.setData({
        fences: realmDataChangeUtil.fences,
        isSpecSelectCompleted: realmDataChangeUtil.isSpecSelectCompleted
      })
    },

  }
})