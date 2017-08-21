"use strict";
var Promise = require("promise.js").Promise;
var app = getApp();

var formatUrl = (url, data) => {
  if (!data) return url;
  if (typeof (data) === "string") {
    return url + data;
  }
  if (typeof (data) === "object") {
    var hasQuery = url.indexOf("?") !== -1;
    for (var key in data) {
      var value = data[key];
      if (value === null) return;
      var mark = "{" + key + "}";
      if (url.indexOf(mark) !== -1)
        url = url.replace(mark, value);
      else {
        var concact = hasQuery ? "&" : "?";
        url += concact + key + "=" + encodeURIComponent(value);
        hasQuery = true;
      }
    };
    return url;
  }
  return url;
};

function Request(url, query = {}, data = {}, method = "GET") {
  url = formatUrl(url, query);
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: data || {},
      header: {
        Authorization: app.getAuthtoken(),
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: method,
      dataType: "json",
      success: res => {
        resolve(res);
      },
      fail: (res) => {
        console.log(res);
        wx.showToast({ title: "网络错误", duration: 5000 });
        reject(res);
      },
      complete: (res) => {
        if (app.globalData.redirected) return;
        if (res.statusCode === 403) {
          if (app.getCurrentPage().route === "pages/login/index") return;
          app.globalData.redirected = true;
          wx.navigateTo({
            url: '../login/index',
            success: function (res) {

            }
          });
        }
      }
    })
  });

}
var REGION = "tj";
var APPID = "1253333391";
var BUCKET_NAME = "yuelinshe";
var DIR_NAME = "/vizcaya/";
module.exports = {
  "get": function (url, query = {}) {
    return Request(url, query, null, "GET");
  },
  "post": function (url, query = {}, data = {}) {
    return Request(url, query, data, "POST");
  },
  "put": function (url, query = {}, data = {}) {
    return Request(url, query, data, "PUT");
  },
  "delete": function (url, query = {}, data = {}) {
    return Request(url, query, data, "DELETE");
  },
  "upload": function (filePath, sign) {
    var fileName = filePath.match(/(wxfile:\/\/)(.+)/);
    fileName = fileName[2];
    return new Promise((resolve, reject) => {
      var url = "https://" + REGION + ".file.myqcloud.com/files/v2/" + APPID + "/" + BUCKET_NAME + DIR_NAME + fileName;
      sign = sign.replace(/[\r\n]/g, '');
      wx.uploadFile({
        url: url,
        filePath: filePath,
        name: 'filecontent',
        formData: {
          op: 'upload'
        },
        header: {
          'Authorization': sign
        },
        success: resolve,
        fail: function (res) {
          console.log(res);
          reject(res);
        }
      })
    });
  }
}