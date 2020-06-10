import {
  OrderException
} from "../core/orderExceiption"
import {
  OrderExceptionType
} from "../core/enum"
import {
  accAdd
} from "../utils/number"
import {
  HttpUtil
} from "../utils/httpUtil"

class Order {
  orderItems //服务端最新获取的
  localItemCount //本地存储的

  constructor(orderItems, localItemCount) {
    this.orderItems = orderItems
    this.localItemCount = localItemCount
  }

  static async postOrderToServer(orderPost) {
    return await HttpUtil.request({
      "url": "order",
      method: "POST",
      data: orderPost,
      throwError: true
    })
  }

  checkOrderIsOK() {
    this.orderItems.forEach((item) => {
      item.isOK()
    })
  }

  orderIsOK() {
    this._emptyOrder()
    this._containNotOnSaleItem()
  }

  getOrderSkuInfoList() {
    return this.orderItems.map(item => {
      return {
        id: item.skuId,
        count: item.count
      }
    })
  }

  getTotalPrice() {
    return this.orderItems.reduce((pre, item) => {
      const price = accAdd(pre, item.finalPrice)
      return price
    }, 0)
  }

  getTotalPriceByCategoryIdList(categoryIdList) {
    if (categoryIdList.length === 0) {
      return 0
    }
    const price = categoryIdList.reduce((pre, categoryId) => {
      const eachPrice = this.getTotalPriceByEachCategory(categoryId)
      return accAdd(pre, eachPrice)
    }, 0)
    return price
  }

  getTotalPriceByEachCategory(categoryId) {
    const price = this.orderItems.reduce((pre, orderItem) => {
      const isItemInCategories = this._isItemInCategories(orderItem, categoryId)
      if (isItemInCategories) {
        return accAdd(pre, orderItem.finalPrice)
      }
      return pre
    }, 0)
    return price
  }


  _emptyOrder() {
    if (this.orderItems.length === 0) {
      throw new OrderException("订单中没有任何商品", OrderExceptionType.EMPTY)
    }
  }


  _containNotOnSaleItem() {
    if (this.orderItems.length !== this.localItemCount) {
      throw new OrderException("服务器返回订单数量与实际不相符，可能是有商品已经下架", OrderExceptionType.NOT_ON_SALE)
    }
  }

  _isItemInCategories(orderItem, categoryId) {
    if (orderItem.categoryId === categoryId) {
      return true
    }
    if (orderItem.rootCategoryId === categoryId) {
      return true
    }
    return false
  }

}

export {
  Order
}