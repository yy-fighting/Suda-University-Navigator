Page({
  data: {
    spotImages: [], // 景点图片数组
    spotDescription: '', // 景点描述文字
    inSpot: false, // 是否在景点范围内
    spotName: '', // 景点名称
    spotId: null // 景点ID
  },

  onLoad: function(options) {
    // 解析传入的参数
    const inSpot = options.inSpot === 'true';
    this.setData({
      inSpot: inSpot
    });

    if (inSpot) {
      // 在景点范围内，加载景点信息
      const spotId = options.spotId;
      const spotName = options.spotName;
      this.setData({
        spotId: spotId,
        spotName: spotName
      });
      this.loadSpotDetails(spotId);
    } else {
      // 不在景点范围内，显示默认图片和提示信息
      this.setData({
        spotImages: ['../../images/route1-bg.jpg'],
        spotDescription: '抱歉，您不在景点范围内'
      });
    }
  },

  loadSpotDetails: function(spotId) {
    // TODO: 从服务器获取景点详情
    // 这里先用模拟数据
    this.setData({
      spotImages: [
        '../../images/spot1.jpg',
        '../../images/spot2.jpg'
      ],
      spotDescription: '这里是景点的详细介绍文字...'
    });
  },

  handleVoiceQuestion: function() {
    if (!this.data.inSpot) {
      wx.showToast({
        title: '不在景点范围内，无法使用语音问答',
        icon: 'none'
      });
      return;
    }
    // TODO: 实现语音问答功能
    wx.showToast({
      title: '语音问答功能开发中',
      icon: 'none'
    });
  },

  handleImageExplanation: function() {
    if (!this.data.inSpot) {
      wx.showToast({
        title: '不在景点范围内，无法使用图片讲解',
        icon: 'none'
      });
      return;
    }
    // TODO: 实现图片讲解功能
    wx.showToast({
      title: '图片讲解功能开发中',
      icon: 'none'
    });
  },

  handleImageError: function(e) {
    console.error('图片加载失败:', e);
    const index = e.currentTarget.dataset.index;
    let images = this.data.spotImages;
    // 使用一个默认图片替换加载失败的图片
    images[index] = '../../images/marker.png';
    this.setData({
      spotImages: images
    });
  }
}); 