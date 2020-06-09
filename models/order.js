import { OrderException } from "../core/orderExceiption"
import { OrderExceptionType } from "../core/enum"

class Order{
  orderItems //服务端最新获取的
  localItemCount  //本地存储的

  constructor(orderItems,localItemCount){
    this.orderItems = orderItems
    this.localItemCount = localItemCount
  }

  checkOrderIsOK(){
    this.orderItems.forEach((item)=>{
      item.isOK()
    })
  }

  orderIsOK(){
    this._emptyOrder()
    this._containNotOnSaleItem()
  }

  _emptyOrder(){
    if(this.orderItems.length === 0){
      throw new OrderException("订单中没有任何商品",OrderExceptionType.EMPTY)
    }
  }


  _containNotOnSaleItem(){
    if(this.orderItems.length !== this.localItemCount){
      throw new OrderException("服务器返回订单数量与实际不相符，可能是有商品已经下架",OrderExceptionType.NOT_ON_SALE)
    }
  }

}

export{
  Order
}