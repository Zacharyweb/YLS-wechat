var articleApi = require("../../utils/data/article.js");
var utils = require("../../utils/util.js");
var app = getApp();
Page(Object.assign({}, utils.TopTips, {
  data: {
    images: []
  },
  onLoad: function (options) {
    this.setData({
      categoryId: options.id
    })
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 3, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.images.concat(tempFilePaths);
        if (imgs.length > 3) imgs = imgs.slice(0, 3);
        that.setData({ images: imgs });
      }
    })
  },
  removeImage: function (e) {
    var that = this;
    var i = e.target.dataset.index;
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex === undefined)
          return;
        that.data.images.splice(i, 1);
        that.setData({
          images: that.data.images
        });
      }
    })
  },
  formSubmit: function (e) {
    var input = e.detail.value;
    var data = {
      articleid: 0,
      author: app.globalData.userInfo.nickName,
      authorImg: app.globalData.userInfo.avatarUrl,
      title: null,
      categoryId: "3",
      categoryName: null,
      content: null,
      description: null,
      img: this.data.images,
      phone: null,
      isPrivate: 1
    };

    Object.assign(data, input);
    data.isPrivate = data.isPrivate ? 1 : 0;
    if (!data.title) {
      this.showZanTopTips('请输入标题！');
      return;
    }
    if (!data.description) {
      this.showZanTopTips('请填写备注信息！');
      return;
    }
    data.content = data.description;
    data.categoryName = data.categoryId === "3" ? "生活服务" : "物有所用";
    wx.showLoading({ title: "发布中...", mask: true });
    articleApi.createArticle(data).then(function () {
      wx.hideLoading();
      wx.navigateBack();
    });
  }
}))