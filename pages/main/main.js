Page({
  data: {
    isDrawerOpen: false, // 控制上拉框的展开状态
    campusLocation: {
      latitude: 30.2697,  // 校园纬度
      longitude: 120.1234 // 校园经度
    },
    markers: [
      {
        id: 1,
        latitude: 30.2697,
        longitude: 120.1234,
        name: '主楼',
        iconPath: '/images/marker.png', // 标记图标路径
        width: 30,
        height: 30
      }
    ]
  },

  // 切换上拉框状态
  toggleDrawer() {
    this.setData({
      isDrawerOpen: !this.data.isDrawerOpen
    });
  },

  // 跳转到路线规划页面
  navigateToRoutePlan() {
    wx.showToast({
      title: '路线规划功能开发中',
      icon: 'none'
    });
  },

  // 跳转到地点收藏页面
  navigateToFavorite() {
    wx.showToast({
      title: '地点收藏功能开发中',
      icon: 'none'
    });
  },

  // 跳转到校园公告页面
  navigateToNotice() {
    wx.showToast({
      title: '校园公告功能开发中',
      icon: 'none'
    });
  },

  // 跳转到个人中心页面
  navigateToProfile() {
    wx.showToast({
      title: '个人中心功能开发中',
      icon: 'none'
    });
  }
});