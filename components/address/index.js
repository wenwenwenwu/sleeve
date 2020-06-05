import {
  Address
} from "../../models/address"
import {
  AuthAddress
} from "../../core/enum"

// components/address/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    address: Object,
    hasChosen: false,
    showDialog: false
  },

  lifetimes: {
    attached() {
      const address = Address.getLocal()
      if (address) {
        this.setData({
          address,
          hasChosen: true
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onChooseAddress(event) {
      const authStatus = await this.hasAuthorizedAddress()
      console.log(authStatus)
      if(authStatus === AuthAddress.DENY){
        this.setData({
          showDialog: true
        })
        return
      }
      this.getUserAddress()
    },

    onDialogConfirm(){
      this.setData({
        
      })
      wx.openSetting()
    },

    async getUserAddress() {
      let res
      try {
        res = await wx.chooseAddress()
      } catch (error) {
        console.log(error)
      }
      if (res) {
        this.setData({
          address: res,
          hasChosen: true
        })
        Address.setLocal(res)
      }
    },

    async hasAuthorizedAddress() {
      const setting = await wx.getSetting()
      const addressSetting = setting.authSetting["scope.address"]
      if (addressSetting === undefined) {
        return AuthAddress.NOT_AUTH
      }
      if (addressSetting === false) {
        return AuthAddress.DENY
      }
      if (addressSetting === true) {
        return AuthAddress.AUTHORIZED
      }
    }
  }
})