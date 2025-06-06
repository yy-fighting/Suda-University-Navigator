const QQMapWX = require('../../utils/qqmap-wx-jssdk.min');

// 引入外部数据
const places = require('../../data/place.js');
const foods = require('../../data/food.js');

Page({
  data: {
    qqmapsdk: null, // 新增SDK实例
    currentTab: 0,
    currentSwiper: 0,
    mapCenter: {
      latitude: 31.306778, // 默认中心点坐标
      longitude: 120.640083
    },
    polyline: [], // 路线数据
    currentLocation: { // 当前位置
      latitude: 31.306778,
      longitude: 120.640083
    },
    markers: [],
    cards: [
      places, // 景点数据来自 place.js
      foods   // 美食数据来自 food.js
    ]
  },

  onLoad() {
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'QGDBZ-RALLV-NJMPI-5FANI-UT6U6-IYFET' // 替换为实际密钥
      })
    });
    this.updateMarkers();
    this.getCurrentLocation(); // 获取当前定位
  },

  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
      }
    });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: parseInt(index),
      currentSwiper: 0,
    }, this.updateMarkers);
  },

  onSwiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
    this.updateMarkers();
  },

  updateMarkers() {
    const dataSource = this.data.cards[this.data.currentTab];
    const currentItem = dataSource[this.data.currentSwiper];
    if (!currentItem) return;

    this.setData({
      mapCenter: {
        latitude: currentItem.lat || currentItem.latitude,
        longitude: currentItem.lng || currentItem.longitude
      },
      markers: [{
        id: 0,
        latitude: currentItem.lat || currentItem.latitude,
        longitude: currentItem.lng || currentItem.longitude,
        width: 20,
        height: 20,
        callout: {
          content: currentItem.name,
          fontSize: 14,
          borderRadius: 5,
          bgColor: "#fff",
          padding: 5,
          display: "ALWAYS"
        }
      }]
    });
  },

  navigateTo(e) {
    const location = e.currentTarget.dataset.location;
    const { currentLocation, qqmapsdk } = this.data;

    qqmapsdk.direction({
      mode: 'walking',
      from: currentLocation,
      to: {
        latitude: location.lat || location.latitude,
        longitude: location.lng || location.longitude
      },
      success: (res) => {
        const coors = res.result.routes[0].polyline;
        const kr = 1000000;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }

        const pl = [];
        for (let i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] });
        }

        this.setData({
          latitude: pl[0]?.latitude,
          longitude: pl[0]?.longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        });
      },
      fail: (error) => {
        console.error(error);
      }
    });
  },

  onFunctionTap(e) {
    const type = e.currentTarget.dataset.type;
    if (type === '路线推荐') {
      wx.navigateTo({
        url: '/pages/routeRecommend/routeRecommend'
      });
    } else if (type === 'AI问答') {
      wx.navigateTo({
        url: '/pages/aiChat/aiChat'
      });
    }
  },

  onsearchTap() {
    wx.navigateTo({
      url: '/pages/searchPage/searchPage'
    });
  }
});