Page({
  data: {
    searchValue: '',
    items: [
      { id: 1, name: '酒店1', description: '酒店1的详细描述' },
      { id: 2, name: '酒店2', description: '酒店2的详细描述' },
      { id: 3, name: '酒店3', description: '酒店3的详细描述' }
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
      url: `/pages/detail/detail?category=stay&id=${id}`,
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