// index.js
Page({
  data: {
    currentTab: 0,
    currentSwiper: 0,
    mapCenter: {
      latitude: 31.306778, // 默认中心点坐标
      longitude: 120.640083
    },
    cards: [
      [
        {
          name: "文星阁",
          latitude: 31.306778,  // 替换为实际经度
          longitude: 120.640083, // 替换为实际纬度
          image: "../../image/wenxinge.png",
          description: "文星阁，又称方塔、钟楼，位于江苏省苏州市姑苏区苏州大学天赐庄校区内...",
          openTime : "薛定谔的开放"
        },
        {
          name: "理工楼",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "../../image/computer-building.png",
          description: "苏州大学理工楼建筑群...",
          openTime:"教学楼8:00-17:00"
        }
      ],
      [
        {
          name : "方塔餐厅",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "../../image/food1.jpg",
          description: "一楼：千里香",
          openTime:"晚上七点左右会逐渐停止营业"
        },
        {
          name : "梅花餐厅",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "../../image/food2.jpg",
          description: "二楼：汉堡",
          openTime:"汉堡好像会开到八九点"
        }
      ]
    ],
    markers: []
  },

  onLoad() {
    this.updateMarkers();
  },

  // 切换标签时重置swiper
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index,
      currentSwiper: 0, // 重置到第一个条目
    }, this.updateMarkers);
  },

  // 轮播图切换事件
  onSwiperChange(e) {
    this.setData({
      currentSwiper: e.detail.current
    });
    this.updateMarkers();
  },

  // 更新地图标记方法
  updateMarkers() {
    const dataSource = this.data.cards[this.data.currentTab];
    const currentItem = dataSource[this.data.currentSwiper];
    
    if (!currentItem) return;

    this.setData({
      mapCenter: {
        latitude: currentItem.latitude,
        longitude: currentItem.longitude
      },
      markers: [{
        id: 0,
        latitude: currentItem.latitude,
        longitude: currentItem.longitude,
        width:20,
        height:20,
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
  // 导航按钮点击事件
  navigateTo(e) {
    const location = e.currentTarget.dataset.location;
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      address: location.description
    });
  }
});
