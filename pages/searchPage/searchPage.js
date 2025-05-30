// pages/searchPage/searchPage.js
Page({

  /**
   * Page initial data
   */
  data: {
    searchValue: ''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 页面加载时的逻辑
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  },

  onSearchInput(e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  onSearch() {
    // 处理搜索逻辑
    const searchValue = this.data.searchValue.trim();
    if (searchValue) {
      // 这里可以添加搜索逻辑
      console.log('搜索内容：', searchValue);
    }
  },

  navigateToCategory(e) {
    const category = e.currentTarget.dataset.category;
    const pageMap = {
      'sights': '/pages/sights/sights',
      'eats': '/pages/eats/eats',
      'stay': '/pages/stay/stay',
      'shop': '/pages/shop/shop',
      'joyzone': '/pages/joyzone/joyzone'
    };

    if (pageMap[category]) {
      wx.navigateTo({
        url: pageMap[category]
      });
    }
  }
})