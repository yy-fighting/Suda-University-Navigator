Page({
  data: {
    searchValue: '',
    items: [
      { id: 1, name: '文心阁', description: '文星阁，又称方塔、钟楼，位于江苏省苏州市姑苏区苏州大学天赐庄校区内，于明万历十七年（1589年）年筑台基，至万历二十四年（1596年）年建成。现存文星阁是万历四十年（1612年）重建的文峰塔。' },
      { id: 2, name: '存菊堂', description: '红楼位于苏州大学本部内，为景海女子师范学校旧址，始建于1902年，已有百年历史，现为苏州大学红楼会议中心。' },
      { id: 3, name: '红楼', description: '红楼位于苏州大学本部内，为景海女子师范学校旧址，始建于1902年，已有百年历史，现为苏州大学红楼会议中心。' }
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
      url: `/pages/detail/detail?category=sights&id=${id}`,
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