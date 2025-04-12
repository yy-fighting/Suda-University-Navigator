// 景点位置配置
const SPOT_LOCATIONS = [
  { 
    id: 1, 
    name: '景点1', 
    latitude: 39.915,
    longitude: 116.404,
    radius: 50
  }
];

const LocationService = {
  getUserLocation: function() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: resolve,
        fail: reject
      });
    });
  },

  checkInSpotRange: function(userLocation) {
    return new Promise((resolve, reject) => {
      if (!userLocation) {
        reject(new Error('未获取到用户位置'));
        return;
      }

      for (const spot of SPOT_LOCATIONS) {
        const distance = this.calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        );

        if (distance <= spot.radius) {
          resolve({
            inSpot: true,
            spotId: spot.id,
            spotName: spot.name
          });
          return;
        }
      }

      resolve({
        inSpot: false
      });
    });
  },

  calculateDistance: function(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const φ1 = this.toRadians(lat1);
    const φ2 = this.toRadians(lat2);
    const Δφ = this.toRadians(lat2 - lat1);
    const Δλ = this.toRadians(lon2 - lon1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  },

  toRadians: function(degrees) {
    return degrees * Math.PI / 180;
  }
};

Page({
  data: {
    longitude: 116.404,
    latitude: 39.915,
    markers: []
  },

  onLoad() {
    this.getLocation();
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      },
      fail: (err) => {
        console.error('获取位置失败:', err);
        this.handleLocationError(err);
      }
    });
  },

  handleLocationError(err) {
    console.error('位置错误:', err);
    if (err.errMsg.includes('auth deny')) {
      wx.showModal({
        title: '需要位置权限',
        content: '请在小程序设置中开启位置权限',
        success(res) {
          if (res.confirm) wx.openSetting();
        }
      });
    }
  },

  // 处理景点讲解按钮点击
  handleSpotGuide: function() {
    LocationService.getUserLocation()
      .then(location => {
        return LocationService.checkInSpotRange(location);
      })
      .then(result => {
        // 无论是否在景点内都跳转，但传递不同的参数
        wx.navigateTo({
          url: `/pages/spot-detail/spot-detail?inSpot=${result.inSpot}${result.inSpot ? `&spotId=${result.spotId}&spotName=${result.spotName}` : ''}`
        });
      })
      .catch(error => {
        wx.showToast({
          title: '无法获取位置信息，请检查位置权限',
          icon: 'none',
          duration: 2000
        });
      });
  },

  // 跳转到路线规划页面
  navigateToRoutePlan() {
    wx.navigateTo({
      url: '/pages/routePlan/routePlan'
    });
  }
});