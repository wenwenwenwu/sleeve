import {
  promisic,
  px2rpx
} from "../miniprogram_npm/lin-ui/utils/util"

const getSystemSize = async function () {
  const res = await promisic(wx.getSystemInfo)()
  return {
    windowWidth: res.windowWidth,
    windowHeight: res.windowHeight,
    screenWidth: res.screenWidth,
    screenHeight: res.screenHeight
  }
}

const getWindowHeightRPX = async function () {
  const res = await getSystemSize()
  return px2rpx(res.windowHeight)
}

export {
  getWindowHeightRPX
}