import {
  HttpUtil
} from "../utils/httpUtil.js";

class Activity {
  static locationD = "a-2"

  static getHomeLocationD() {
    return HttpUtil.request({
      url: `activity/name/${Activity.locationD}`
    })
  }
}

export {
  Activity
}