import {
  promisic
} from '../miniprogram_npm/lin-ui/utils/util.js'
import {
  codes
} from '../config/config-exception';
import {
  config
} from '../config/config.js';

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
      HttpUtil._showError(-1)
    }
    const code = res.statusCode.toString()
    //请求成功
    if (code.startsWith('2')) {
      return res.data
    } else {
      //token异常
      if (code === '401') {
        // 重新请求（只做一次）
        if (!data.refetched) {
          HttpUtil._refetch({
            url,
            data,
            method
          })
        }
      } else {
        if (throwError) {
          throw new HttpException(res.data.code, res.data.message, code)
        }
        if (code === '404') {
          if (res.data.code !== undefined) {
            return null
          }
          return res.data
        }
        const error_code = res.data.code;
        HttpUtil._showError(error_code, res.data)
      }
      // 403 404 500
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