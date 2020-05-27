import {
  Realm
} from "../models/realm"
import {
  RealmDataChangeUtil
} from "../models/realm-data-change-util.js"

// components/realm/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    orderWay: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    realmDataChangeUtil: Object,
    realm: Object
  },

  observers: {
    "spu": function (spu) {
      if (!spu) {
        return
      }
      const realm = new Realm(spu)
      this.data.realmDataChangeUtil = new RealmDataChangeUtil(realm)
      this.data.realmDataChangeUtil.changeDefaultSku()
      this.setData({
        realm: this.data.realmDataChangeUtil.realm,
      })
      this.changeSpec()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCellTap(event) {
      const model = event.detail.model
      this.data.realmDataChangeUtil.changeSpec(model)
      this.setData({
        realm: this.data.realmDataChangeUtil.realm
      })
      this.changeSpec()
    },

    onSelectCount(event) {
      const shoppingCount = event.detail.count
      this.data.realmDataChangeUtil.changeShoppingCount(shoppingCount)
      this.setData({
        realm: this.data.realmDataChangeUtil.realm
      })
    },

    changeSpec() {
      this.triggerEvent("changeSpec", {
        realm: this.data.realm
      })
    },

    onBuyOrCart(event) {
      const realm = this.data.realm
      const isNoSpec = realm.isNoSpec
      const isSpecSelectCompleted = realm.isSpecSelectCompleted
      const missingSpecKeys = realm.missingSpecKeys
      const selectedSku = realm.selectedSku
      const shoppingCount = realm.shoppingCount
      if (!isNoSpec && !isSpecSelectCompleted) { //多种规格且选择未完成
        wx.showToast({
          icon: "none",
          title: `请选择:${missingSpecKeys.join(",")}`,
          duration: 3000
        })
        return
      }
      this.triggerEvent('shopping', {
        orderWay: this.properties.orderWay,
        spuId: this.properties.spu.id,
        sku: selectedSku,
        skuCount: shoppingCount
      });

    }
  }
})