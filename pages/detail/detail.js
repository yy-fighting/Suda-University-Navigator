Page({
  data: {
    category: '', // 分类：sights, eats, stay, shop, joyzone
    id: '', // 具体项目的id
    title: '', // 页面标题
    backgroundImage: '', // 背景图片
    detailImage: '', // 详情图片
    detailName: '', // 详情名称
    detailDescription: '' // 详情描述
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
      // 这里后续可以根据id从服务器获取具体内容
      detailImage: '', // 暂时为空
      detailName: '示例名称', // 暂时为示例
      detailDescription: '这里是详细的介绍内容，后续可以根据id从服务器获取具体内容。' // 暂时为示例
    });
  }
}); 