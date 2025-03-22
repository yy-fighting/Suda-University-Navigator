Page({
  data: {
    account: '',
    password: ''
  },

  // 账号输入事件
  onAccountInput(e) {
    this.setData({
      account: e.detail.value
    });
  },

  // 密码输入事件
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value
    });
  },

  // 登录按钮点击事件
  onLogin() {
    const { account, password } = this.data;
    if (account.trim() === '') {
      wx.showToast({
        title: '请输入账号',
        icon: 'none'
      });
      return;
    }
    if (password.trim() === '') {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    // 模拟登录成功，跳转到主界面
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1000,
      success: () => {
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/main/main'
          });
        }, 1000);
      }
    });
  }
});