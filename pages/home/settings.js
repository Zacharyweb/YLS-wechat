var authApi = require("../../utils/data/auth.js");
var app = getApp();
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
     this.setData({
      photo: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName
    });
  },
  exit: function () {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: function (res) {
        if (res.confirm) {
          authApi.logout();
          wx.redirectTo({ url: "../login/index" });
        }
      }
    });
  }
})