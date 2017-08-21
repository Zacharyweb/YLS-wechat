// pages/album/comment.js
var articleApi = require("../../utils/data/article.js");
var utils = require("../../utils/util.js");
var value = '';
var id = 0;
Page(Object.assign({}, utils.TopTips, {
  data: {},
  onLoad: function (options) {
    id = options.id;
  },
  inputChange: function (event) {
    value = event.detail.value;
  },
  submit: function () {
    var that = this;
    if (!value) {
      this.showZanTopTips('评论内容不能为空！');
      return;
    }
    articleApi.comment({ relationId: id, relationType: 2, text: value, parentId: 0 }).then(res => {
      wx.navigateBack();
    });
  }
}));