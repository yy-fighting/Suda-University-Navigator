Page({
  data: {
    bg1: "/images/route1-bg.jpg",
    bg2: "/images/route2-bg.jpg",
    bg3: "/images/route3-bg.jpg",
    bg4: "/images/route4-bg.jpg"
  },

  // 只有路线一可跳转
  navigateToRoute1() {
    wx.navigateTo({
      url: '/pages/routeDetail/routeDetail'
    });
  },
})