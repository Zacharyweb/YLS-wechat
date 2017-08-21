var albumApi = require("../../utils/data/album.js");
var utils = require("../../utils/util.js");
var articleApi = require("../../utils/data/article.js");
var app = getApp();
Page({
  data: {
    imgs: [],
    index: 0
  },

  onLoad: function (options) {
    var that = this;
    albumApi.getAlbumPhotos(options.id).then(res => {
      var data = res.data.data.map(function (item) {
        return {
          src: "http://yuelinshe-1253333391.costj.myqcloud.com/" + item.filename,
          id: item.albumitemid
        };
      })
      that.setData({
        imgs: data,
        id: options.id
      });
    });
  },
  swiperChange: function (e) {
    var that = this;
    that.setData({
      index: e.detail.current
    });
  },
  doCommend: function (e) {
    var that = this;
    var current = that.data.imgs[that.data.index];
    articleApi.setCommend({ relationId: current.id, relationType: 2, status: that.data.commended ? 0 : 1 }).then(res => {
      wx.showToast({
        icon: "success",
        duration: 3000,
        title: !that.data.commended ? "已点赞！" : "已取消！"
      });
      that.setData({ commended: !that.data.commended });
      //return articleApi.getArticleCommend(that.data.options.id);
    }).then(res => {

    });
  },
  onShareAppMessage: function () {
    return {
      title: "悦邻舍",
      desc: "美图",
      path: '/pages/album/preview?id=' + this.data.id
    }
  }
})