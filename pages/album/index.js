var albumApi = require("../../utils/data/album.js");
var utils = require("../../utils/util.js")
var currentIndex = 0;
var app = getApp();
Page(Object.assign({}, utils.Dialog, {
  data: {
    pictures: []
  },
  onShow: function () {
    var that = this;
    albumApi.getAlbums().then(res => {
      var data = res.data.data.map(d => {
        d.src = "http://yuelinshe-1253333391.costj.myqcloud.com/" + d.albumImg;
        d.commentItems.map(citem => {
          citem.reply = citem.child.length > 0 ? citem.child[0].Content : "";
        });
        return d;
      });
      that.setData({
        pictures: data
      });
    });
  },
  onLoad: function (options) {

  },
  loadMore: function () {
    // var pic = this.data.pictures[currentIndex].comment;
    // pic.push({
    //   firstUserImg: "http://yuelinshe-1253333391.costj.myqcloud.com//vizcaya/1490797336413.jpg",
    //   firstUserTime: "3小时前",
    //   firstUserName: "小明",
    //   firstUserComments: "超美的图片的啊，美爆了超美的图片的啊，美爆了超美的图片的啊，美爆了超美的图片的啊，美爆了超美的图片的啊，美爆了"
    // });
    // this.setData({
    //   pictures: this.data.pictures
    // });
  },
  swiperPhoto: function (event) {
    currentIndex = event.detail.current;
  },
  doCommend: function () {
    wx.navigateTo({
      url: '../album/post'
    });
  },
  doComments: function () {
    var current = this.data.pictures[currentIndex];
    wx.navigateTo({
      url: '../album/comment?id=' + current.AlbumId
    });
  },
  onShareAppMessage: function () {
    return {
      title: "悦邻舍",
      desc: "美图",
      path: '/pages/album/index'
    }
  }
}));