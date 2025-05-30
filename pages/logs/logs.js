// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  
  onLoad() {
    // 保留原有的日志记录功能
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    });
    
    // 添加自动跳转到搜索主页面的逻辑
    wx.switchTab({
      url: '/pages/searchPage/searchPage' // 跳转到搜索主页面
    });
  },
  
  // 如果需要保留手动返回日志页面的能力，可以添加这个生命周期函数
  onShow() {
    // 可以在这里添加一些逻辑，当从其他页面返回时执行
  }
})