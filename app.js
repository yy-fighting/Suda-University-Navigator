// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "cloud1-7gs0f84u1eadb862",// 环境id
        traceUser: true,
      });
    }

    this.globalData = {};
  },
});