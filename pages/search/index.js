var articleApi = require("../../utils/data/article.js");

var timeOut = null;
Page({
  data: {
    articles: []
  },
  onLoad: function (options) {
    var infoUrl, returnUrl;
    options.id == 3 || options.id == 4 ?
      (returnUrl = "../share/index") && (infoUrl = "../share/info") :
      (returnUrl = "../index/index") && (infoUrl = "../info/index");

    this.setData({
      articles: [],
      categoryId: options.id,
      returnUrl: returnUrl,
      infoUrl: infoUrl
    });
  },
  search: function (event) {
    var that = this;
    var keyword = event.detail.value;
    timeOut && clearTimeout(timeOut);
    timeOut = setTimeout(function () {
      that._search(keyword);
    }, 500);
  },
  _search: function (keyword) {
    var that = this;
    if (!keyword) {
      that.setData({ articles: [] });
      return;
    }
    articleApi.getList({ text: keyword, categoryId: that.data.categoryId }, false)
      .then(function (res) {
        that.setData({ articles: res.data.data });
      });
  }
})