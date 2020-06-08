import {
  promisic
} from '../miniprogram_npm/lin-ui/utils/util.js'
import {
  codes
} from '../config/config-exception';
import {
  config
} from '../config/config.js';
import {
  HttpException
} from '../core/httpException.js';

class HttpUtil {

  static async request({
    url,
    data,
    method = 'GET',
    throwError = false
  }) {
    let res;
    try {
      res = await promisic(wx.request)({
        url: `http://localhost:8081/v1/${url}`,
        data,
        method,
        header: {
          'content-type': 'application/json',
          appkey: config.appkey,
          'authorization': `Bearer ${wx.getStorageSync('token')}`
        }
      })
    } catch (e) {
      if (throwError) {
        throw new HttpException(-1, codes[-1])
      }
      HttpUtil._showError(-1)
      return null //抛出的话
    }
    const code = res.statusCode.toString()
    //请求成功
    if (code.startsWith("2")) {
      return res.data
    } else {
      //token异常
      //onLaunch中token未校验完成便执行了网络请求
      //验证时可用的token使用时过期了
      if (code === "401") {
        //这两种极偶然的情况发生时，需要重新请求（只做一次）
        if (!data.refetched) {
          HttpUtil._refetch({
            url,
            data,
            method
          })
        }
      } else {
        if(throwError){
          throw new HttpException(res.data.code,res.data.message,code)
        }
        //数据未找到
        //数据有对象型和数组型两种，前端希望数据在有值和空值时返回的类型相同
        //对象型空数据，服务端返回的原始值是UnifyResponse，需要转换为null
        //数组型空数据，服务端返回的原始值是包含空数组的分页对象，直接返回即可
        if (code === "404") { //数据未找到
          //对象型数据
          if (res.data.code !== undefined) {
            return null
          }
          //数组型数据
          return res.data
        }
        const error_code = res.data.code;
        HttpUtil._showError(error_code, res.data)
      }
    }
    return res.data
  }

  static async _refetch(data) {
    const token = new Token()
    await token.getTokenFromServer()
    data.refetched = true
    return await HttpUtil.request(data)
  }

  static _showError(error_code, serverError) {
    let tip

    if (!error_code) {
      tip = codes[9999]
    } else {
      if (codes[error_code] === undefined) {
        tip = serverError.message
      } else {
        tip = codes[error_code]
      }
    }
    wx.showToast({
      icon: "none",
      duration: 3000,
      title: tip,
    })
  }
}

export {
  HttpUtil
}