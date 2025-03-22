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
    wx.navigateTo({
      url: '/pages/routePlan/routePlan'
    });
  },

  // 跳转到地点收藏页面
  navigateToFavorite() {
    wx.navigateTo({
      url: '/pages/favorite/favorite'
    });
  },

  // 跳转到校园公告页面
  navigateToNotice() {
    wx.navigateTo({
      url: '/pages/notice/notice'
    });
  },

  // 跳转到个人中心页面
  navigateToProfile() {
    wx.navigateTo({
      url: '/pages/PersonalCenter/PersonalCenter'
    });
  }
});