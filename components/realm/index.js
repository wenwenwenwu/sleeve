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
      const realmDataChangeUtil = this.data.realmDataChangeUtil
      realmDataChangeUtil.defaultChange()
      // realm.isSpecSelectCompleted = realmDataChangeUtil.isSpecSelectCompleted
      // realm.fences = realmDataChangeUtil.fences
      this.setData({
        realm,
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCellTap(event) {
      const model = event.detail.model
      const realmDataChangeUtil = this.data.realmDataChangeUtil
      realmDataChangeUtil.change(model)
      // const realm = this.data.realm
      const realm = realmDataChangeUtil.realm
      // realm.fences = realmDataChangeUtil.realm.fences
      this.setData({
        realm
      })
    },

  }
})