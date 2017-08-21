var api = require("../restapi.js");
var Promise = require("../promise.js").Promise;
var app = getApp();

module.exports = {
  validation: function () {
    console.log("登录验证");
    var token = app.getAuthtoken();
    if (!token) {
      wx.navigateTo({
        url: '../login/index',
        success: function (res) {
          // success
        },
        fail: function () {
          // fail
        },
        complete: function () {
          // complete
        }
      });
      console.log("未登录");
    }
  },
  getUserInfo: function () {
    var that = app;
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(that.globalData.userInfo)
      } else {
        console.log("call:getUserInfo");
        //调用登录接口
        wx.login({
          success: function () {
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo;
                resolve(res.userInfo);
              },
              fail: function (res) {
                reject(res);
                console.log(res);
                that.showZanTopTips(res.errMsg || "授权失败");
              }
            })
          },
          fail: function (res) {
            reject(res);
            console.log(res);
            that.showZanTopTips(res.errMsg || "授权失败");
          }
        })
      }
    }).then(function (wxUser) {
      return api.get("/api/user/userinfo");
    }).then(function (res) {
      //取得之前用户的头像昵称信息
      var user = res.statusCode === 500 ? app.getUser() : res.data;
      console.log(res);
      user.nickname && (that.globalData.userInfo.nickName = user.nickname);
      user.img && user.img !== "undefined" && (that.globalData.userInfo.avatarUrl = user.img);
    });
  },
  login: function (data) {
    return api.post("/api/user/bindingwechat", null, data);
  },
  sendCode: function (phone, code) {
    return api.get("/api/user/sendTsCode", { phone: phone, code: code });
  },
  logout: function () {
    app.setAuthtoken(null);
  },
  userinfo: function () {
    return api.get("/api/user/userinfo");
  }
}