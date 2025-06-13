const QQMapWX = require('../../utils/qqmap-wx-jssdk.min')

Page({
  data: {
    qqmapsdk: null,
    routePlaces: [], // 存储路线中的地点信息
    currentLocation: null, // 当前位置
    polyline: [], // 导航路线
    markers: [], // 地图标记点
    mapCenter: {
      latitude: 31.306778,
      longitude: 120.640083
    },
    isNavigating: false, // 是否正在导航
    completedPath: [], // 已完成的路径
    remainingPath: [], // 剩余的路径
    lastLocation: null, // 上一个位置
    isSimulating: false, // 是否正在模拟
    simulationInterval: null, // 模拟定时器
    currentSimulationIndex: 0, // 当前模拟点索引
    scale: 16, // 地图缩放级别
    simulationSpeed: 2000, // 模拟速度（毫秒）
    currentMarker: null, // 当前位置标记
    currentInstruction: '', // 当前导航指令
    nextTurnDistance: 0, // 距离下一个转弯点的距离
    routeSegments: [], // 路线段数组
    currentSegment: 0, // 当前路线段索引
    segmentPoints: [], // 当前段的路径点
    remainingDistance: 0, // 剩余距离
    estimatedTime: 0, // 预计剩余时间
    walkingSpeed: 1.4 // 步行速度（米/秒）
  },

  onLoad(options) {
    // 初始化SDK
    this.setData({
      qqmapsdk: new QQMapWX({
        key: 'QGDBZ-RALLV-NJMPI-5FANI-UT6U6-IYFET'
      })
    })

    // 获取路由参数中的地点ID数组
    if (options.placeIds) {
      const placeIds = JSON.parse(options.placeIds)
      this.processRoutePlaces(placeIds)
    }
  },

  // 处理路线地点数据
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
    }, () => {
      // 计算路线段
      this.calculateRouteSegments()
    })
  },

  // 计算路线段
  calculateRouteSegments() {
    const { routePlaces } = this.data
    if (routePlaces.length < 2) return

    // 计算每段路线
    const calculateNextSegment = (index) => {
      if (index >= routePlaces.length - 1) {
        // 所有路线段计算完成，开始导航
        this.startNavigation()
        return
      }

      const from = {
        latitude: routePlaces[index].lat,
        longitude: routePlaces[index].lng
      }
      const to = {
        latitude: routePlaces[index + 1].lat,
        longitude: routePlaces[index + 1].lng
      }

      // 获取路线
      this.getRoute(from, to, index, (points, steps) => {
        if (!points || !steps) {
          console.error('获取路线失败')
          return
        }

        const routeSegments = this.data.routeSegments
        routeSegments.push({
          points,
          steps,
          from: routePlaces[index],
          to: routePlaces[index + 1]
        })

        this.setData({ routeSegments }, () => {
          // 计算下一段
          calculateNextSegment(index + 1)
        })
      })
    }

    // 开始计算第一段
    calculateNextSegment(0)
  },

  // 获取路线
  getRoute(from, to, index, callback) {
    const { qqmapsdk } = this.data
    qqmapsdk.direction({
      mode: 'walking',
      from,
      to,
      success: (res) => {
        if (res.status !== 0 || !res.result || !res.result.routes || !res.result.routes[0]) {
          console.error('路线数据格式错误：', res)
          callback(null, null)
          return
        }

        const route = res.result.routes[0]
        const points = this.decodePolyline(route.polyline)
        const steps = route.steps.map(step => ({
          instruction: step.instruction,
          distance: step.distance,
          duration: step.duration,
          dir_desc: step.dir_desc,
          road_name: step.road_name,
          polyline: this.decodePolyline(step.polyline)
        }))

        callback(points, steps)
      },
      fail: (error) => {
        console.error('获取路线失败：', error)
        callback(null, null)
      }
    })
  },

  // 解码路线点
  decodePolyline(polyline) {
    if (!polyline) return []
    
    const points = []
    const kr = 1e6
    
    let prevLat = 0
    let prevLng = 0
    
    try {
      // 检查polyline是否为数组
      if (Array.isArray(polyline)) {
        for (let i = 0; i < polyline.length; i += 2) {
          const encLat = Number(polyline[i])
          const encLng = Number(polyline[i + 1])
          
          if (isNaN(encLat) || isNaN(encLng)) {
            console.error('无效的坐标值：', polyline[i], polyline[i + 1])
            continue
          }
          
          if (i === 0) {
            prevLat = encLat
            prevLng = encLng
          } else {
            prevLat += encLat / kr
            prevLng += encLng / kr
          }
          
          points.push({
            latitude: prevLat,
            longitude: prevLng
          })
        }
      } else if (typeof polyline === 'string') {
        // 处理字符串格式的polyline
        const coors = polyline.split(';')
        for (let i = 0; i < coors.length; i += 2) {
          const encLat = Number(coors[i])
          const encLng = Number(coors[i + 1])
          
          if (isNaN(encLat) || isNaN(encLng)) {
            console.error('无效的坐标值：', coors[i], coors[i + 1])
            continue
          }
          
          if (i === 0) {
            prevLat = encLat / kr
            prevLng = encLng / kr
          } else {
            prevLat += encLat / kr
            prevLng += encLng / kr
          }
          
          points.push({
            latitude: prevLat,
            longitude: prevLng
          })
        }
      } else {
        console.error('不支持的polyline格式：', polyline)
        return []
      }
    } catch (error) {
      console.error('解码路线点失败：', error)
      return []
    }
    
    return points
  },

  // 开始导航
  startNavigation() {
    const { routeSegments } = this.data
    if (!routeSegments.length) {
      console.error('没有可用的路线段')
      return
    }

    // 设置初始位置和路径
    const firstSegment = routeSegments[0]
    if (!firstSegment || !firstSegment.points || !firstSegment.points.length) {
      console.error('第一段路线数据无效')
      return
    }

    this.setData({
      isNavigating: true,
      currentLocation: firstSegment.points[0],
      lastLocation: firstSegment.points[0],
      completedPath: [],
      remainingPath: firstSegment.points.slice(1),
      segmentPoints: firstSegment.points,
      currentSegment: 0
    }, () => {
      // 更新地图标记
      this.updateMarkers()
      // 开始模拟
      this.startSimulation()
    })
  },

  // 开始模拟
  startSimulation() {
    const { remainingPath } = this.data
    if (!remainingPath.length) return

    this.setData({
      isSimulating: true
    })

    // 开始模拟移动
    const simulationInterval = setInterval(() => {
      const { currentSimulationIndex, remainingPath, routeSegments, currentSegment } = this.data
      
      if (currentSimulationIndex >= remainingPath.length) {
        // 当前段结束，检查是否还有下一段
        if (currentSegment < routeSegments.length - 1) {
          // 移动到下一段
          const nextSegment = routeSegments[currentSegment + 1]
          if (!nextSegment || !nextSegment.points || !nextSegment.points.length) {
            console.error('下一段路线数据无效')
            clearInterval(simulationInterval)
            return
          }

          this.setData({
            currentSegment: currentSegment + 1,
            currentSimulationIndex: 0,
            remainingPath: nextSegment.points,
            segmentPoints: nextSegment.points
          })
          return
        } else {
          // 所有段都完成
          clearInterval(simulationInterval)
          this.setData({
            isSimulating: false,
            simulationInterval: null
          })
          wx.showToast({
            title: '已到达目的地',
            icon: 'success',
            duration: 2000
          })
          return
        }
      }

      // 更新位置
      const newLocation = remainingPath[currentSimulationIndex]
      const newCompletedPath = [...this.data.completedPath, newLocation]
      const newRemainingPath = remainingPath.slice(currentSimulationIndex + 1)
      
      this.setData({
        currentLocation: newLocation,
        lastLocation: this.data.currentLocation,
        currentSimulationIndex: currentSimulationIndex + 1,
        completedPath: newCompletedPath,
        remainingPath: newRemainingPath
      }, () => {
        this.updateMarkers()
        this.updatePathProgress(newLocation)
      })
    }, this.data.simulationSpeed)

    this.setData({ simulationInterval })
  },

  // 更新路径进度
  updatePathProgress(currentLocation) {
    // 更新路线显示
    const newPolyline = []
    
    // 添加已完成的路径（半透明）
    if (this.data.completedPath.length > 0) {
      newPolyline.push({
        points: this.data.completedPath,
        color: '#FF000066', // 半透明红色
        width: 4,
        arrowLine: true
      })
    }
    
    // 添加剩余路径（不透明）
    if (this.data.remainingPath.length > 0) {
      newPolyline.push({
        points: this.data.remainingPath,
        color: '#FF0000DD', // 不透明红色
        width: 4,
        arrowLine: true
      })
    }

    // 更新地图显示
    this.setData({
      polyline: newPolyline,
      mapCenter: currentLocation
    }, () => {
      // 更新地图视野
      this.updateMapView()
      // 更新导航指令
      this.updateNavigationInstruction(currentLocation)
    })
  },

  // 更新导航指令
  updateNavigationInstruction(currentLocation) {
    const { routeSegments, currentSegment, segmentPoints, currentSimulationIndex } = this.data
    if (!routeSegments.length || currentSegment >= routeSegments.length) return

    const currentRouteSegment = routeSegments[currentSegment]
    if (!currentRouteSegment || !currentRouteSegment.steps) return

    // 计算剩余总距离和预计时间
    let totalRemainingDistance = 0
    let currentStepDistance = 0

    // 计算当前段剩余距离
    for (let i = currentSimulationIndex; i < segmentPoints.length - 1; i++) {
      const point = segmentPoints[i]
      const nextPoint = segmentPoints[i + 1]
      currentStepDistance += this.calculateDistance(
        point.latitude,
        point.longitude,
        nextPoint.latitude,
        nextPoint.longitude
      )
    }

    // 计算后续段的总距离
    for (let i = currentSegment + 1; i < routeSegments.length; i++) {
      const segment = routeSegments[i]
      if (segment && segment.points) {
        for (let j = 0; j < segment.points.length - 1; j++) {
          const point = segment.points[j]
          const nextPoint = segment.points[j + 1]
          totalRemainingDistance += this.calculateDistance(
            point.latitude,
            point.longitude,
            nextPoint.latitude,
            nextPoint.longitude
          )
        }
      }
    }

    totalRemainingDistance += currentStepDistance

    // 计算预计剩余时间（分钟）
    const estimatedTime = Math.ceil(totalRemainingDistance / (this.data.walkingSpeed * 60))

    // 获取当前步骤的导航指令
    let instruction = ''
    const currentStep = currentRouteSegment.steps.find(step => {
      return step.polyline && step.polyline.some(point => 
        Math.abs(point.latitude - currentLocation.latitude) < 0.0001 && 
        Math.abs(point.longitude - currentLocation.longitude) < 0.0001
      )
    })

    if (currentStep) {
      instruction = currentStep.instruction
    } else {
      // 如果找不到当前步骤，检查是否需要切换到下一段
      if (currentSimulationIndex >= segmentPoints.length - 2 && currentSegment < routeSegments.length - 1) {
        const nextSegment = routeSegments[currentSegment + 1]
        if (nextSegment && nextSegment.steps && nextSegment.steps.length > 0) {
          instruction = nextSegment.steps[0].instruction
        }
      } else {
        instruction = '继续前行'
      }
    }

    this.setData({
      currentInstruction: instruction,
      remainingDistance: Math.round(totalRemainingDistance),
      estimatedTime: estimatedTime
    })
  },

  // 计算方位角
  calculateBearing(point1, point2) {
    const lat1 = this.deg2rad(point1.latitude)
    const lat2 = this.deg2rad(point2.latitude)
    const lng1 = this.deg2rad(point1.longitude)
    const lng2 = this.deg2rad(point2.longitude)

    const y = Math.sin(lng2 - lng1) * Math.cos(lat2)
    const x = Math.cos(lat1) * Math.sin(lat2) -
              Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1)
    let bearing = Math.atan2(y, x)
    bearing = this.rad2deg(bearing)
    return (bearing + 360) % 360
  },

  // 获取转弯指令
  getTurnInstruction(currentBearing, nextBearing) {
    const angleDiff = (nextBearing - currentBearing + 360) % 360
    
    if (angleDiff > 330 || angleDiff < 30) return '继续直行'
    if (angleDiff > 30 && angleDiff < 150) return '右转'
    if (angleDiff > 150 && angleDiff < 210) return '掉头'
    if (angleDiff > 210 && angleDiff < 330) return '左转'
    
    return '转弯'
  },

  // 角度转弧度
  deg2rad(deg) {
    return deg * (Math.PI / 180)
  },

  // 弧度转角度
  rad2deg(rad) {
    return rad * (180 / Math.PI)
  },

  // 更新地图标记
  updateMarkers() {
    const { routePlaces, currentLocation } = this.data
    if (!routePlaces.length) return

    // 创建地点标记
    const placeMarkers = routePlaces.map((place, index) => ({
      id: index,
      latitude: place.lat,
      longitude: place.lng,
      width: 30,
      height: 30,
      iconPath: index === routePlaces.length - 1 ? '/data/images/end.png' : '/data/images/point.png',
      anchor: { x: 0.5, y: 0.5 },
      callout: {
        content: place.name,
        fontSize: 14,
        borderRadius: 5,
        bgColor: "#fff",
        padding: 5,
        display: "ALWAYS"
      }
    }))

    // 添加当前位置标记
    if (currentLocation) {
      placeMarkers.push({
        id: 'current',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        width: 30,
        height: 30,
        iconPath: '/data/images/start.png',
        anchor: { x: 0.5, y: 0.5 }
      })
    }

    this.setData({ 
      markers: placeMarkers,
      currentMarker: currentLocation ? placeMarkers[placeMarkers.length - 1] : null
    })
  },

  // 更新地图视野
  updateMapView() {
    const { currentLocation, remainingPath } = this.data
    if (!currentLocation || !remainingPath.length) return

    // 只在初始化和切换路段时更新地图视野
    if (this.data.currentSimulationIndex === 0) {
      // 计算视野范围，确保包含当前位置和剩余路径
      let points = [currentLocation, ...remainingPath]
      const bounds = this.calculateMapBounds(points)
      if (!bounds) return

      // 计算中心点，稍微偏向当前位置
      const center = {
        latitude: currentLocation.latitude + (bounds.maxLat - bounds.minLat) * 0.2,
        longitude: currentLocation.longitude
      }

      // 计算合适的缩放级别
      const latDiff = bounds.maxLat - bounds.minLat
      const lngDiff = bounds.maxLng - bounds.minLng
      const maxDiff = Math.max(latDiff, lngDiff)
      let scale = 16
      if (maxDiff > 0.01) scale = 15
      if (maxDiff > 0.02) scale = 14
      if (maxDiff > 0.05) scale = 13

      this.setData({
        mapCenter: center,
        scale: scale
      })
    }
  },

  // 计算地图视野范围
  calculateMapBounds(points) {
    if (!points || points.length === 0) return null

    let minLat = points[0].latitude
    let maxLat = points[0].latitude
    let minLng = points[0].longitude
    let maxLng = points[0].longitude

    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude)
      maxLat = Math.max(maxLat, point.latitude)
      minLng = Math.min(minLng, point.longitude)
      maxLng = Math.max(maxLng, point.longitude)
    })

    // 添加一些边距
    const padding = 0.001 // 约100米
    return {
      minLat: minLat - padding,
      maxLat: maxLat + padding,
      minLng: minLng - padding,
      maxLng: maxLng + padding
    }
  },

  // 计算两点之间的距离（米）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371 // 地球半径，单位公里
    const dLat = this.deg2rad(lat2 - lat1)
    const dLng = this.deg2rad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // 距离，单位公里
    return distance * 1000 // 转换为米
  },

  // 结束导航
  endNavigation() {
    if (this.data.simulationInterval) {
      clearInterval(this.data.simulationInterval)
    }
    
    this.setData({
      isNavigating: false,
      isSimulating: false,
      polyline: [],
      completedPath: [],
      remainingPath: [],
      lastLocation: null,
      simulationInterval: null,
      currentSimulationIndex: 0,
      routeSegments: [],
      currentSegment: 0,
      segmentPoints: []
    }, () => {
      setTimeout(() => {
        wx.navigateBack()
      }, 100)
    })
  }
}) 