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
        },
        {
          name: "博远楼",
          latitude: 31.306370,
          longitude: 120.641097,
          description: "博远楼，学生们日常上课的教学楼之一，共四层。",
          image: "../../data/images/image3.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "梅花食堂",
          latitude: 31.307317,
          longitude: 120.641172,
          description: "本部两个食堂之一，共三层，一二两层为学生食堂，一层有苏式面、手抓饼、石锅饭等，二层有自选快餐、麻辣烫等，三楼是招待外宾关灯餐厅，需预约",
          image: "../../data/images/image4.png",
          opentime:"8:00-12:00"
        },
        {
          name: "红楼会议中心",
          latitude: 31.303528,
          longitude: 120.641268,
          description: "红楼位于苏州大学本部内，为景海女子师范学校旧址，始建于1902年，已有百年历史，现为苏州大学红楼会议中心。",
          image: "../../data/images/image6.png",
          opentime:"8:00-12:00"
        },
        {
          name: "存菊堂",
          latitude: 31.304849,
          longitude: 120.641047,
          description: "存菊堂，位于本部图书馆旁，是一座常用于开展会议庆典的礼堂。",
          image: "../../data/images/image7.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "本部图书馆",
          latitude: 31.304167,
          longitude: 120.641139,
          description:"本部图书馆，共五层，可供同学们借阅图书、自习背书。",
          image: "../../data/images/image8.png",
          opentime:"8:00-12:00"
        },
        {
          name: "苏大文创店",
          latitude: 31.303349,
          longitude: 120.640634,
          description:"苏大文创店，售卖苏大特有的创意文创用品，是外来游客游玩留念的不二之选。",
          image: "../../data/images/image9.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "东吴大学老校门",
          latitude: 31.303297,
          longitude: 120.641015,
          description:"东吴大学旧址大门，　北面正中为校门其形式为中西合璧，即校门主体仿中国传统牌楼建造，四柱三门，不过三门皆为西式的半圆拱券形式，正面书写 东吴大学 四个大字，背面书写 劵天地正气，法古今完人 。",
          image: "../../data/images/image10.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "钟楼",
          latitude: 31.302440,
          longitude: 120.641157,
          description:"钟楼位法学院前，是一座极具特色的红楼建筑。",
          image: "../../data/images/image11.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "苏州大学博物馆",
          latitude: 31.301065,
          longitude: 120.641907,
          description:"苏州大学博物馆是华东地区历史艺术类高校博物馆。2007年3月，苏州大学博物馆成立。2010年5月10日，正式开馆。2021年12月9日，苏州大学博物馆官网显示，苏州大学博物馆现有藏品5633件（含文物3297件），涵盖书画、碑刻、石器、陶器、瓷器、铜器、银器、玉器、钱币、木雕、古籍、布艺、校史实物等类别。",
          image: "../../data/images/image12.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "王建法学院",
          latitude: 31.300910,
          longitude: 120.641492,
          description:"苏州大学王健法学院，隶属于苏州大学，为江苏省最早成立的法律人才培养的基地。苏州大学王健法学院的前身是创建于1915年的东吴大学法学院。2000年5月，毕业于东吴大学法学院的王健先生重返母校，关心法学教育发展，由其子王嘉廉先生捐资支持法学院建设，苏州大学法学院更名为苏州大学王健法学院",
          image: "../../data/images/image13.png",
          opentime:"8:00-12:00"
        },
  
        {
          name: "南门",
          latitude: 31.300602,
          longitude: 120.641426,
          description:"苏州大学南门，出门可前往十梓街、十全街等景点。",
          image: "../../data/images/image14.png",
          opentime:"8:00-12:00"
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
            latitude: 31.306778, //res.latitude
            longitude: 120.640083 //res.longitude
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
