const places = require('../../data/place.js');

Page({
  data: {
    routes: [
      {
        title: '北门校园文化路线',
        img: '/pages/routeRecommend/images/route1-bg.png',
        desc: '校园核心景点游览',
        placeIds: [1, 2, 4, 3, 7, 8],
        detail: {
          day: '',
          summary: '这条路线涵盖了苏州大学本部的核心景点，从北门出发，经过理工大楼、梅花食堂、博远楼、存菊堂，最后到达本部图书馆。这条路线适合想要快速了解苏大校园文化的游客。',
          places: [],
          tips: ''
        }
      },
      {
        title: '北门历史建筑路线',
        img: '/pages/routeRecommend/images/route2-bg.png',
        desc: '历史建筑 文化底蕴',
        placeIds: [1, 5, 6, 9, 10],
        detail: {
          day: '',
          summary: '这条路线以历史文化为主题，从北门出发，经过文星阁、红楼会议中心、苏大文创店，最后到达东吴大学老校门。这条路线适合想要深入了解苏大历史文化的游客。',
          places: [],
          tips: ''
        }
      },
      {
        title: '南门人文景点路线',
        img: '/pages/routeRecommend/images/route3-bg.png',
        desc: '南门风光 人文景观',
        placeIds: [14, 13, 12, 11, 10],
        detail: {
          day: '',
          summary: '这条路线以南部景点为主，从南门出发，经过王建法学院、苏州大学博物馆、钟楼，最后到达东吴大学老校门。这条路线适合想要探索苏大南部人文景观的游客。',
          places: [],
          tips: ''
        }
      }
    ],
    selectedIdx: 0
  },

  onLoad() {
    // 初始化路线信息
    this.initRoutes();
  },

  initRoutes() {
    const routes = this.data.routes.map(route => {
      const routePlaces = route.placeIds.map(id => {
        return places.find(place => place.id === id);
      }).filter(place => place); // 过滤掉未找到的地点
      
      // 生成路线描述
      const dayDesc = routePlaces.map(place => place.name).join('-');
      
      // 生成景点介绍
      const placesDesc = routePlaces.map(place => ({
        name: place.name,
        desc: place.desc,
        image: place.image
      }));

      // 生成tips
      const tips = routePlaces.map(place => place.name).join('、');

      return {
        ...route,
        detail: {
          ...route.detail,
          day: dayDesc,
          places: placesDesc,
          tips: tips
        }
      };
    });

    this.setData({ routes });
  },

  onRouteTab(e) {
    this.setData({ selectedIdx: e.currentTarget.dataset.idx });
  },

  onMapTap() {
    const currentRoute = this.data.routes[this.data.selectedIdx];
    wx.navigateTo({
      url: `/pages/routeMap/routeMap?placeIds=${JSON.stringify(currentRoute.placeIds)}`
    });
  }
});