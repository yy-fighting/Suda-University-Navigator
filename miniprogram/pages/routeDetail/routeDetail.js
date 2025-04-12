Page({
  data: {
    longitude: 116.404,  // 默认坐标（天安门）
    latitude: 39.915,
    markers: [{
      id: 1,
      latitude: 39.915,
      longitude: 116.404,
      iconPath: '/images/start.png',
      width: 30,
      height: 30,
      title: '起点'
    }, {
      id: 2,
      latitude: 39.925,
      longitude: 116.414,
      iconPath: '/images/end.png',
      width: 30,
      height: 30,
      title: '终点'
    }],
    polyline: [{
      points: [
        {latitude: 39.915, longitude: 116.404},
        {latitude: 39.925, longitude: 116.414}
      ],
      color: "#07C160",
      width: 6
    }],
    routeDescription: "这里是详细的路线介绍内容..."
  },

  onLoad(options) {
    this.routeId = options.id || 1;
    // 实际项目中这里可以调用接口获取路线详情数据
  },

  // 简化后的开始导航功能 - 仅做页面跳转
  startNavigation() {
    // 准备导航参数
    const navigationParams = {
      start: JSON.stringify({
        latitude: 39.915, 
        longitude: 116.404
      }),
      end: JSON.stringify({
        latitude: 39.925,
        longitude: 116.414
      }),
      routeId: this.routeId
    };

    // 跳转到导航页面
    wx.navigateTo({
      url: `/pages/navigation/navigation?${this.objToQuery(navigationParams)}`,
      fail(err) {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '无法打开导航',
          icon: 'none'
        });
      }
    });
  },

  // 将对象转为URL查询字符串
  objToQuery(obj) {
    return Object.keys(obj).map(key => `${key}=${encodeURIComponent(obj[key])}`).join('&');
  },

  // 地图标记点点击事件
  onMarkerTap(e) {
    console.log('点击标记点:', e.markerId);
  }
});