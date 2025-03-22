Page({
  data: {},

  // 退出登录按钮点击事件
  onLogout() {
    wx.showToast({
      title: '退出登录成功',
      icon: 'success',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          wx.navigateBack({
            url: '/pages/favorite/favorite'
          });
        }, 1000);
      }
    });
  }
});