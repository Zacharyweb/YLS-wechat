var WxParse = require('../../utils/wxParse/wxParse.js');
var utils = require("../../utils/util.js");
var articleApi = require("../../utils/data/article.js");
var app = getApp();

module.exports = Object.assign({}, utils.Dialog, utils.TopTips, {
  data: {
    commended: false,
    commends: [

    ],
    comments: [],
    single: {},
    html: ``,
    id: {}
  },
  onLoad: function (options) {
    var that = this;
    this.setData({ id: options.id });

  },
  onShow: function () {
    var that = this;
    articleApi.getArticle(that.data.id)
      .then(function (values) {
        values[0].data.data.createtime = new Date(values[0].data.data.createtime).Format("yyyy-MM-dd");
        WxParse.wxParse('article', 'html', values[0].data.data.content || values[0].data.data.description, that, 5);

        var commands = [];
        for (var i = 0; i < values[1].data.data.length; i++) {
          commands.push(values[1].data.data[i].img);
        }
        that.setData({ single: values[0].data.data, commends: commands });
      });
    articleApi.getArticleComments(that.data.id).then(res => {
      var comments = [];
      for (var i = 0; i < res.data.data.length; i++) {
        var item = res.data.data[i];
        comments.push({
          content: item.Content,
          img: item.img,
          nickName: item.nickName,
          time: item.time,
          reply: item.child.length > 0 ? item.child[0].Content : ""
        });
      }
      that.setData({ comments: comments });
    });
  },
  loadMore: function () {
    // this.setData({
    //   comments: this.data.comments.concat(data)
    // })
  },
  doCommend: function () {
    var that = this;
    articleApi.setCommend({ relationId: this.data.id, relationType: 1, status: that.data.commended ? 0 : 1 }).then(res => {
      !that.data.commended && wx.showToast({
        icon: "success",
        duration: 3000,
        title: "支持！"
      });
      that.setData({ commended: !that.data.commended });
      return articleApi.getArticle(that.data.id);
    }).then(values => {
      var commands = [];
      for (var i = 0; i < values[1].data.data.length; i++) {
        commands.push(values[1].data.data[i].img);
      }
      that.setData({
        commends: commands,
        "single.commends": values[0].data.data.commends
      });
    });
  },
  onShareAppMessage: function () {
    var page = app.getCurrentPage();
    var path = page.route === "pages/share/info" ? "pages/share/info?id=" :"/pages/info/index?id="
    return {
      title: this.data.single.title,
      desc: this.data.single.categoryname,
      path: path + this.data.id
    }
  }
});