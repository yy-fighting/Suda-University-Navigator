const QQMapWX = require('../../utils/qqmap-wx-jssdk.min')

Page({
  data: {
    qqmapsdk: null,
    routePlaces: [], // 存储路线中的景点信息
    currentLocation: null, // 当前位置
    polyline: [], // 导航路线
    markers: [], // 地图标记点
    mapCenter: {
      latitude: 31.306778,
      longitude: 120.640083
    },
    currentStep: 0, // 当前导航步骤
    navigationSteps: [], // 导航步骤数组
    totalDistance: 0, // 总距离
    totalDuration: 0, // 总时间
    isNavigating: false // 是否正在导航
  },

  // 👇 把 getRoute 放入 Page 的方法对象中
  getRoute(from, to, stepIndex, callback) {
    const { qqmapsdk } = this.data
    qqmapsdk.direction({
      mode: 'walking',
      from,
      to,
      success: (res) => {
        console.log('API 返回结果:', res);
        const route = res.result.routes[0]
        const distance = route.distance
        const duration = route.duration
        const steps = route.steps.map((step, index) => ({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration,
          polyline: this.decodePolyline(step.polyline)
        }))

        // 更新路线
        const newPolyline = this.data.polyline.concat([{
          points: this.decodePolyline(route.polyline),
          color: '#FF0000DD',
          width: 4
        }])

        this.setData({
          polyline: newPolyline
        })

        if (callback) {
          callback(distance, duration, steps)
        }      
      },
      fail: (error) => {
        console.error('获取路线失败：', error)
        wx.showToast({
          title: '获取路线失败',
          icon: 'none'
        })
      }
    })
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
    const places = require('../../data/place.js')
    const routePlaces = placeIds.map(id => {
      return places.find(place => place.id === id)
    }).filter(place => place)

    this.setData({
      routePlaces,
      mapCenter: {
        latitude: routePlaces[0]?.lat || 31.306778,
        longitude: routePlaces[0]?.lng || 120.640083
      }
    })

    // 更新地图标记
    this.updateMarkers()
  },

  // 更新地图标记
  updateMarkers() {
    const { routePlaces } = this.data
    if (!routePlaces.length) return

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

    this.setData({ markers })
  },

  // 获取当前定位
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          //定位不准使用，虚拟定位
          currentLocation: {
            latitude: 31.306778,
            longitude: 120.640083
          }
        }, () => {
          // 获取到位置后开始导航
          this.startNavigation()
        })
      },
      fail: (error) => {
        console.error('获取位置失败：', error)
        wx.showToast({
          title: '获取位置失败',
          icon: 'none'
        })
      }
    })
  },

  // 在 startNavigation() 中，替换景点之间的路线请求部分
  startNavigation() {
    const { routePlaces, currentLocation, qqmapsdk } = this.data;
    if (!routePlaces.length || !currentLocation) return;

    let totalDistance = 0;
    let totalDuration = 0;
    let navigationSteps = [];

    // 先计算当前位置到第一个景点的路线
    this.getRoute(currentLocation, {
      latitude: routePlaces[0].lat,
      longitude: routePlaces[0].lng
    }, 0, (distance, duration, steps) => {
      totalDistance += distance;
      totalDuration += duration;
      navigationSteps = navigationSteps.concat(steps);
    });

    // 使用 async 函数来控制后续请求
    const fetchRoutes = async () => {
      for (let i = 0; i < routePlaces.length - 1; i++) {
        const from = {
          latitude: routePlaces[i].lat,
          longitude: routePlaces[i].lng
        };
        const to = {
          latitude: routePlaces[i + 1].lat,
          longitude: routePlaces[i + 1].lng
        };

        // 👇 添加延迟，避免频繁请求
        await new Promise(resolve => setTimeout(resolve, 1200)); // 每次间隔至少1.2秒

        this.getRoute(from, to, i + 1, (distance, duration, steps) => {
          totalDistance += distance;
          totalDuration += duration;
          navigationSteps = navigationSteps.concat(steps);

          // 如果是最后一次请求，更新数据
          if (i === routePlaces.length - 2) {
            this.setData({
              totalDistance,
              totalDuration,
              navigationSteps,
              isNavigating: true
            });
          }
        });
      }
    };

    fetchRoutes();
  },

  decodePolyline(polyline) {
    if (!polyline) {
      console.warn('polyline 数据为空');
      return [];
    }
  
    let coors = [];
  
    if (typeof polyline === 'string') {
      // 字符串分割成数字数组
      coors = polyline.split(';').map(Number);
    } else if (Array.isArray(polyline)) {
      // 使用 concat 复制数组，代替扩展运算符 [...polyline]
      coors = [].concat(polyline); // ✅ 不再使用扩展运算符
    } else {
      console.warn('未知的 polyline 格式:', typeof polyline);
      return [];
    }
  
    const points = [];
    const kr = 1e6; // 编码因子，用于还原小数位
  
    let prevLat = 0;
    let prevLng = 0;
  
    for (let i = 0; i < coors.length; i += 2) {
      const encLat = coors[i];
      const encLng = coors[i + 1];
  
      // 如果是第一个点，则为绝对坐标
      if (i === 0) {
        prevLat = encLat / kr;
        prevLng = encLng / kr;
      } else {
        // 后续点是相对前一个点的增量
        prevLat += encLat / kr;
        prevLng += encLng / kr;
      }
  
      points.push({
        latitude: prevLat,
        longitude: prevLng
      });
    }
  
    return points;
  },


  // 下一步导航
  nextStep() {
    const { currentStep, navigationSteps } = this.data
    if (currentStep < navigationSteps.length - 1) {
      this.setData({
        currentStep: currentStep + 1
      })
    }
  },

  // 上一步导航
  prevStep() {
    const { currentStep } = this.data
    if (currentStep > 0) {
      this.setData({
        currentStep: currentStep - 1
      })
    }
  },

  // 结束导航
  endNavigation() {
    this.setData({
      isNavigating: false,
      currentStep: 0,
      polyline: []
    })
    wx.navigateBack()
  }
}) 