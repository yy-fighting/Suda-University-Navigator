// index.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min')
Page({
  data: {
    qqmapsdk: null, // 新增SDK实例
    currentTab: 0,
    currentSwiper: 0,
    mapCenter: {
      latitude: 31.306778, // 默认中心点坐标
      longitude: 120.640083
    },
    polyline: [], // 新增路线数据
    currentLocation: { // 新增当前位置
      latitude: 31.306778,
      longitude: 120.640083
    },
    cards: [
      [
        {
          name: "文星阁",
          latitude: 31.306778,  // 替换为实际经度
          longitude: 120.640083, // 替换为实际纬度
          image: "images/wenxinge.png",
          description: "文星阁，又称方塔、钟楼，位于江苏省苏州市姑苏区苏州大学天赐庄校区内。于明万历十七年（1589年）年筑台基，至万历二十四年（1596年）年建成。现存文星阁是万历四十年（1612年）重建的文峰塔。 ",
          openTime : "活动时间开放"
        },
        {
          name: "理工楼",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "images/computer-building.png",
          description: "苏州大学理工楼建筑群...",
          openTime:"8:00-17:00"
        }
      ],
      [
        {
          name : "方塔餐厅",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "images/food1.jpg",
          description: "一楼：千里香",
          openTime:"晚上七点左右会逐渐停止营业"
        },
        {
          name : "梅花餐厅",
          latitude: 31.308659,  // 替换为实际经度
          longitude: 120.639693, // 替换为实际纬度
          image: "images/food2.jpg",
          description: "二楼：汉堡",
          openTime:"汉堡好像会开到八九点"
        }
      ]
    ],
    markers: []
  },

  onLoad() {
    // 初始化SDK
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'QGDBZ-RALLV-NJMPI-5FANI-UT6U6-IYFET' // 替换为实际密钥
      })
    })
    this.updateMarkers();
    this.getCurrentLocation(); // 获取当前定位
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
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: parseInt(index),
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
  async navigateTo(e) {
    var _this = this;
    const location = e.currentTarget.dataset.location
    const { currentLocation, qqmapsdk } = _this.data
    qqmapsdk.direction({
      mode: 'walking',
      from:currentLocation,
      to: location, 
      success: function (res) {
        console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          // 将路线起点展示在当前位置
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  // 页面跳转逻辑
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
  onsearchTap(){
    wx.navigateTo({
      url:'/pages/searchPage/searchPage'
    });
  }
});
