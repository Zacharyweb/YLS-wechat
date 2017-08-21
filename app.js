
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
  },
  getAuthtoken: function () {
    var token = wx.getStorageSync('token') || '';
    return token;
  },
  setAuthtoken: function (token) {
    wx.setStorageSync('token', token);
  },
  setUser: function (user) {
    this.globalData.userInfo.avatarUrl = user.img;
    this.globalData.userInfo.nickName = user.nickname;
    wx.setStorageSync('user', user);
  },
  getUser: function () {
    var user = wx.getStorageSync('user') || {};
    return user;
  },
  globalData: {
    userInfo: null,
    gateway: "https://www.yuelinshe.com/vizcaya/",
  }
})