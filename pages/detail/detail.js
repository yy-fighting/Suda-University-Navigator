// 引入数据文件
const eatsData = require('../../data/eats.js');
const sightsData = require('../../data/sights.js');
const shopData = require('../../data/shop.js');
const stayData = require('../../data/stay.js');
const joyzoneData = require('../../data/joyzone.js');

Page({
  data: {
    category: '', // 分类：sights, eats, stay, shop, joyzone
    id: '', // 具体项目的id
    title: '', // 页面标题
    backgroundImage: '', // 背景图片
    detailImage: '', // 详情图片
    detailName: '', // 详情名称
    detailDescription: '', // 详情描述
    location: '', // 位置信息
    loading: true // 加载状态
  },

  onLoad(options) {
    // 获取传递的参数
    const { category, id } = options;
    
    // 根据分类设置背景图
    const backgroundMap = {
      'sights': '../../data/images/searchPage_background.png',
      'eats': '../../data/images/eats_background.webp',
      'stay': '../../data/images/stay_background.webp',
      'shop': '../../data/images/shop_background.jpg',
      'joyzone': '../../data/images/joyzone_background.png'
    };

    // 根据分类设置标题
    const titleMap = {
      'sights': '景点详情',
      'eats': '美食详情',
      'stay': '住宿详情',
      'shop': '购物详情',
      'joyzone': '娱乐详情'
    };

    this.setData({
      category,
      id,
      title: titleMap[category] || '详情',
      backgroundImage: backgroundMap[category] || backgroundMap['sights'],
      loading: true
    });

    // 加载具体内容
    this.loadDetailContent(category, id);
  },

  loadDetailContent(category, id) {
    // 根据分类选择对应的数据源
    const dataMap = {
      'eats': eatsData,
      'sights': sightsData,
      'shop': shopData,
      'stay': stayData,
      'joyzone': joyzoneData
    };

    const categoryData = dataMap[category] || [];
    const itemData = categoryData.find(item => item.id === parseInt(id)) || {
      name: '暂无数据',
      describe: '该项目的详细信息正在完善中...',
      image: '',
      location: ''
    };

    this.setData({
      detailName: itemData.name,
      detailImage: itemData.image || '', // 暂时使用空图片
      detailDescription: itemData.describe,
      location: itemData.location,
      loading: false
    });
  },

  // 跳转到导航页面
  navigateToMap() {
    const { category, id, detailName, location } = this.data;
    // 将位置信息传递给导航页面
    wx.navigateTo({
      url: `/pages/navigation/navigation?name=${detailName}&location=${location}`,
      fail: (err) => {
        console.error('导航跳转失败：', err);
        wx.showToast({
          title: '导航跳转失败',
          icon: 'none'
        });
      }
    });
  },

  // 图片加载失败处理
  onImageError() {
    wx.showToast({
      title: '图片加载失败',
      icon: 'none'
    });
  }
}); 