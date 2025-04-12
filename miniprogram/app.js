App({
  onLaunch(options) {
    // 小程序初始化时执行，全局只触发一次
    console.log('小程序启动', options);
  },
  onShow(options) {
    // 小程序启动或从后台进入前台时触发
    console.log('小程序显示', options);
  },
  onHide() {
    // 小程序从前台进入后台时触发
    console.log('小程序隐藏');
  },
  onError(error) {
    // 小程序发生脚本错误或 API 调用失败时触发
    console.error('小程序错误', error);
  },
  globalData: {
    // 全局数据
    userInfo: null,
    campusLocation: {
      latitude: 30.2697,  // 校园纬度
      longitude: 120.1234 // 校园经度
    }
  }
});