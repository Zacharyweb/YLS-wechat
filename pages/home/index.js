// pages/home/index.js
var app = getApp();
Page({
  data: {

  },
  onShow: function () {
    this.setData({
      photo: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName
    });
  }
})