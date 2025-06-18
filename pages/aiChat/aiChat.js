Page({
  // ...
  data: {
    chatMode: "bot", // bot 表示使用agent，model 表示使用大模型，两种选一种配置即可
    showBotAvatar: true, // 是否在对话框左侧显示头像
    agentConfig: {
      botId: "bot-13b7f565", // agent id,
      allowWebSearch: true, // 允许客户端选择启用联网搜索
      allowUploadFile: true, // 允许上传文件
      allowPullRefresh: true, // 允许下拉刷新
      allowUploadImage: true, // 允许上传图片
      allowMultiConversation: true, // 允许客户端界面展示会话列表及新建会话按钮
      showToolCallDetail: true, // 允许展示 mcp server toolcall 细节
      allowVoice: true, // 允许展示语音按钮
    },
    modelConfig: {
      modelProvider: "hunyuan-open", // 大模型服务厂商
      quickResponseModel: "hunyuan-lite", // 大模型名称
      logo: "../../data/images/ai.png", // model 头像
      welcomeMsg: "欢迎语", // model 欢迎语
    },
  },
  // ...
  onReady() {
    // 添加错误监听
    this.selectComponent('#ai-chat').onError = (err) => {
      console.error('AI组件错误:', err);
      wx.showToast({ title: `错误:${err.code}`, icon: 'none' });
    };
  }
})