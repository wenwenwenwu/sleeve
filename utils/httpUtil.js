import {
  config
} from '../config/config'

import {
  promisic
} from '../miniprogram_npm/lin-ui/utils/util.js'

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
        url: `${config.apiBaseUrl}${url}`,
        data,
        method,
        header: {
          'content-type': 'application/json',
          appkey: config.appkey,
          'authorization': `Bearer ${wx.getStorageSync('token')}`
        }
      })
    } catch (e) {
      // if (throwError) {
      //   throw new HttpException(-1, codes[-1])
      // }
      // Http.showError(-1)
      // return null
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
          Http._refetch({
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
        Http.showError(error_code, res.data)
      }
      // 403 404 500
    }
    return res.data
  }

  static async _refetch(data) {
    const token = new Token()
    await token.getTokenFromServer()
    data.refetched = true
    return await Http.request(data)
  }
}

export {
  HttpUtil
}