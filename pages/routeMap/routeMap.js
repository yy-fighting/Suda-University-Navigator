// index.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
const places = require('../../data/place.js')

Page({
  data: {
    qqmapsdk: null,
    currentTab: 0,
    currentSwiper: 0,
    mapCenter: {
      latitude: 31.306778,
      longitude: 120.640083
    },
    polyline: [],
    currentLocation: {
      latitude: 31.306778,
      longitude: 120.640083
    },
    cards: [[]],
    markers: [],
    routePlaces: [] // 存储路线中的景点信息
  },

  onLoad(options) {
    // 初始化SDK
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'QGDBZ-RALLV-NJMPI-5FANI-UT6U6-IYFET'
      })
    })

    // 获取路由参数中的景点ID数组
    if (options.placeIds) {
      const placeIds = JSON.parse(options.placeIds)
      this.processRoutePlaces(placeIds)
    }

    this.getCurrentLocation()
  },

  // 处理路线景点数据
  processRoutePlaces(placeIds) {
    const routePlaces = placeIds.map(id => {
      return places.find(place => place.id === id)
    }).filter(place => place) // 过滤掉未找到的景点

    // 更新路线数据
    this.setData({
      routePlaces,
      cards: [routePlaces], // 更新卡片数据
      mapCenter: {
        latitude: routePlaces[0]?.lat || 31.306778,
        longitude: routePlaces[0]?.lng || 120.640083
      }
    })

    // 更新地图标记和路线
    this.updateRouteMarkers()
  },

  // 更新地图标记和路线
  updateRouteMarkers() {
    const { routePlaces } = this.data
    if (!routePlaces.length) return

    // 创建标记点
    const markers = routePlaces.map((place, index) => ({
      id: index,
      latitude: place.lat,
      longitude: place.lng,
      width: 20,
      height: 20,
      callout: {
        content: place.name,
        fontSize: 14,
        borderRadius: 5,
        bgColor: "#fff",
        padding: 5,
        display: "ALWAYS"
      }
    }))

    // 创建路线
    const points = routePlaces.map(place => ({
      latitude: place.lat,
      longitude: place.lng
    }))

    this.setData({
      markers,
      polyline: [{
        points,
        color: '#FF0000DD',
        width: 4
      }]
    })
  },

  // 获取当前定位
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        })
      }
    })
  },

  // 切换标签时重置swiper
  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentTab: parseInt(index),
      currentSwiper: 0
    })
  },

  // 轮播图切换事件
  onSwiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    })
  },

  // 导航功能
  async navigateTo(e) {
    const { cards, currentTab, currentSwiper } = this.data;
    const currentRouteCards = cards[currentTab];

    if (!currentRouteCards || currentRouteCards.length === 0) {
      console.error("No cards available for navigation.");
      wx.showToast({
        title: '无导航信息',
        icon: 'none'
      });
      return;
    }

    // 获取所有景点的ID
    const placeIds = currentRouteCards.map(card => card.id);

    // 跳转到导航页面
    wx.navigateTo({
      url: `/pages/lead/lead?placeIds=${JSON.stringify(placeIds)}`
    });
  },

  // 页面跳转逻辑
  onFunctionTap(e) {
    const type = e.currentTarget.dataset.type
    if (type === '路线推荐') {
      wx.navigateTo({
        url: '/pages/routeRecommend/routeRecommend'
      })
    } else if (type === 'AI问答') {
      wx.navigateTo({
        url: '/pages/aiChat/aiChat'
      })
    }
  }
})
