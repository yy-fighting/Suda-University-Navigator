Page({
  data: {
    longitude: 116.404,
    latitude: 39.915,
    distance: 1500,
    duration: 25,
    markers: [{
      id: 1,
      latitude: 39.915,
      longitude: 116.404,
      iconPath: '/images/start.png',
      width: 30,
      height: 30
    },{
      id: 2,
      latitude: 39.925,
      longitude: 116.414,
      iconPath: '/images/end.png',
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [
        {latitude: 39.915, longitude: 116.404},
        {latitude: 39.925, longitude: 116.414}
      ],
      color: "#07C160",
      width: 6
    }]
  },

  onLoad(options) {
    // 解析URL参数
    const { 
      startLat, 
      startLng, 
      endLat, 
      endLng, 
      routeId 
    } = options;
  
    // 转换为数值类型
    this.setData({
      startPoint: {
        latitude: parseFloat(startLat),
        longitude: parseFloat(startLng)
      },
      endPoint: {
        latitude: parseFloat(endLat),
        longitude: parseFloat(endLng)
      },
      routeId: routeId
    });
  },

  // 初始化导航
  initNavigation(start, end) {
    // 调用高德API（需配置高德小程序或H5）
    this.fetchAmapRoute(start, end).then(res => {
      this.updateRouteDisplay(res);
    });
  },

  // 模拟高德API调用
  fetchAmapRoute(start, end) {
    return new Promise(resolve => {
      // 实际项目替换为真实API调用
      setTimeout(() => {
        resolve({
          distance: 1800,
          duration: 30,
          path: [
            {latitude: start.latitude, longitude: start.longitude},
            {latitude: 39.920, longitude: 116.410},
            {latitude: end.latitude, longitude: end.longitude}
          ]
        });
      }, 500);
    });
  },

  // 更新路线显示
  updateRouteDisplay(routeData) {
    this.setData({
      distance: routeData.distance,
      duration: routeData.duration,
      polyline: [{
        points: routeData.path,
        color: "#07C160",
        width: 6,
        arrowLine: true
      }]
    });
  },

  // 开始语音讲解
  startAudioGuide() {
    //wx.showLoading({ title: '准备讲解中...' });
    
    // 调用语音API（示例）
    // const backgroundAudioManager = wx.getBackgroundAudioManager();
    // backgroundAudioManager.title = '景点语音讲解';
    // backgroundAudioManager.src = 'https://example.com/audio-guide.mp3';
    
    // backgroundAudioManager.onPlay(() => {
    //   wx.hideLoading();
    // });
  }
});