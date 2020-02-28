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
    method = 'GET'
  }) {
    const res = await promisic(wx.request)({
      url: `${config.apiBasicUrl}${url}`,
      method,
      data,
      header: {
        appKey: config.appKey
      },
    })
    return res.data
  }

}

export {
  HttpUtil 
}