// pages/shop/shop.js
Page({
  data: {
    searchValue: '',
    items: [
      { id: 1, name: '购物1', description: '购物1的详细描述' },
      { id: 2, name: '购物2', description: '购物2的详细描述' },
      { id: 3, name: '购物3', description: '购物3的详细描述' }
    ],
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
      item.description.toLowerCase().includes(searchValue)
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