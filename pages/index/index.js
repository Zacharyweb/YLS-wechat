var authApi = require("../../utils/data/auth.js");
var articleApi = require("../../utils/data/article.js");
var utils = require("../../utils/util.js");
var currentId = 1;

//获取应用实例
var app = getApp()
Page(Object.assign({}, utils.TopTips, {
  data: {
    userInfo: {},
    loginIngo: {},
    menus: [
      { id: -1, text: "全部", selected: "" }
    ],
    articles: [],
    currentId: 1
  },
  onShow: function () {
    this.getTinyArticleList(currentId);
  },
  getTinyArticleList: function () {
    var that = this;
    articleApi.getList({ text: "", categoryId: currentId })
      .then(function (res) {
        that.setData({ articles: res.data.data });
        return res;
      }).then(function (res) {
        if (that.data.currentId != 1)
          return;
        if (that.data.menus.length != 1)
          return;
        if (res.data.count)
          that.setData({ menus: [{ id: 1, text: "重要", selected: "bar-item-select" }].concat(that.data.menus) });
        else {
          that.clickmenu({
            target: {
              id: -1
            }
          })
        }
      });
  },
  clickmenu: function (e) {
    currentId = parseInt(e.target.id);
    for (var i = 0; i < this.data.menus.length; i++) {
      var item = this.data.menus[i];
      if (item.id == currentId) {
        item.selected = "bar-item-select";
      } else {
        item.selected = "";
      }
    }
    this.setData({ menus: this.data.menus, currentId: currentId });
    this.getTinyArticleList(currentId);
  },
  onLoad: function () {
    var that = this;
    authApi.getUserInfo().then(function (userInfo) {
      that.getTinyArticleList(currentId);
    });
  },
  onShareAppMessage: function () {
    return {
      title: "悦邻舍",
      desc: "主页",
      path: '/pages/index/index'
    }
  }
}));
