var articleApi = require("../../utils/data/article.js");
var utils = require("../../utils/util.js");
Page({
  data: {
    menus: [
      { id: 3, text: "生活服务", selected: "bar-item-select" },
      { id: 4, text: "物有所用", selected: "" }
    ],
    articles: [],
    currentId: 3 //3：生活服务，4：物有所有
  },
  clickmenu: function (e) {
    var currentId = parseInt(e.target.id);
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
  getTinyArticleList: function () {
    var that = this;
    articleApi.getList({ text: "", categoryId: that.data.currentId })
      .then(function (res) {
        that.setData({ articles: res.data.data });
      });
  },
  onLoad: function (options) {
    this.getTinyArticleList(this.data.currentId);
  },
  onShow: function () {
    this.getTinyArticleList(this.data.currentId);
  }
})