// pages/login/index.js
var authApi = require("../../utils/data/auth.js");
var utils = require("../../utils/util.js");
var app = getApp();
var model = {};
var interval = null;
var time = 60;
var code = null;
Page(Object.assign({}, utils.TopTips, utils.Dialog, {
  data: {
    codeText: '发送验证码',
    isSending: false
  },
  bindChange: function (e) {
    model.phone = e.detail.value
  },
  showDialog: function () {
    this.toggleDialog();
  },
  dialogSave: function () {
    this.setData({
      "user.nickName": this.data.Dialog.value
    });
    this.showDialog();
  },
  sendphone: function (e) {
    var that = this;
    if (!model.phone) {
      that.showZanTopTips('请输入手机号！');
      return;
    }
    if (interval) return;
    that.setData({
      isSending: true
    });
    code = Math.random().toFixed(4).substring(2);
    authApi.sendCode(model.phone, code).then(function (res) {
      interval = setInterval(function () {
        time--;
        that.setData({
          codeText: "剩余" + time + "s",
          isSending: true
        });
        if (time <= 0) {
          clearInterval(interval);
          that.setData({
            codeText: "验证码",
            isSending: false
          });
        }
      }, 1000);
    });
  },
  submit: function (e) {
    Object.assign(model, e.detail.value);
    if (!model.phone) {
      this.showZanTopTips('请输入手机号！');
      return;
    }
    if (!model.code) {
      this.showZanTopTips('请输入短信验证码！');
      return;
    }

    if (model.code !== code) {
      this.showZanTopTips('验证码不正确！');
      return;
    }
    model.img = app.globalData.userInfo.avatarUrl;
    model.code = "123456";
    model.userName = model.phone;
    model.nickName = this.data.Dialog.value;
    authApi.login(model).then(function (res) {
      console.log(res);
      if (res.data.statusCode == 0) {
        app.setAuthtoken(res.data.data.token);
      } else {
        this.showZanTopTips('验证码错误!');
        return;
      }
      return authApi.userinfo();
    }).then(function (res) {
      console.log(res);
      var userinfo = res.data;
      app.setUser(userinfo);
      wx.navigateBack();
    });
  },
  onLoad: function () {
    var that = this;
    authApi.getUserInfo().then(function (userInfo) {
      that.setData({
        user: app.globalData.userInfo,
        "Dialog.value": app.globalData.userInfo.nickName
      });
    });
  },
  onShow: function () {
    app.globalData.redirected = false;
  }
}))