// pages/shop/shop.js
// 引入数据文件
const shopData = require('../../data/shop.js');

Page({
  data: {
    searchValue: '',
    items: shopData,
    filteredItems: [] // 用于存储过滤后的项目
  },

  onLoad() {
    // 初始化时显示所有项目
    this.setData({
      filteredItems: this.data.items
    });
  },

  onSearchInput(e) {
    const searchValue = e.detail.value.toLowerCase();
    const filteredItems = this.data.items.filter(item => 
      item.name.toLowerCase().includes(searchValue) || 
      item.describe.toLowerCase().includes(searchValue)
    );
    
    this.setData({
      searchValue,
      filteredItems
    });
  },

  navigateToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/detail?category=shop&id=${id}`,
      fail: (err) => {
        console.error('导航失败：', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  }
}) 