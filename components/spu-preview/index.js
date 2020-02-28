// components/spu-preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags: Array,
    width: Number,
    height: Number
  },

  observers: {
    "data": function (data) {
      if (data == null) {
        return
      }
      if (!data.tags) {
        return
      }
      const tags = data.tags.split("$")
      this.setData({
        tags
      })
    }
  },


  /**
   * 组件的方法列表
   */
  methods: {
    onImageLoad(event) {
      const {
        width,
        height
      } = event.detail
      this.setData({
        width: 340,
        height: 340 * height / width
      })
    },

    onItemTap(){
      const pid = this.properties.data.id
      wx.navigateTo({
        url: `/pages/detail/index?pid=${pid}`,
      })
    }
  }
})