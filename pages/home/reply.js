// pages/home/reply.js
var utils = require("../../utils/util.js");
var articleApi = require("../../utils/data/article.js");
Page({
  data: {
    coments: []
  },
  onLoad: function (options) {
    debugger;
    // 页面初始化 options为页面跳转所带来的参数
    articleApi.getMyComments().then(function(){
      debugger;
       that.setData({ coments: res.data.data });
    })
  }
})