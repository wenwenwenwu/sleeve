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
      this.data.realmDataChangeUtil.defaultChange()
      this.setData({
        realm: this.data.realmDataChangeUtil.realm,
      })
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
    },

    onSelectCount(event) {
      const shoppingCount = event.detail.count
      this.data.realmDataChangeUtil.changeShoppingCount(shoppingCount)
      this.setData({
        realm: this.data.realmDataChangeUtil.realm
      })
    },



  }
})