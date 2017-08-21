var albumApi = require("../../utils/data/album.js");
var utils = require("../../utils/util.js");
var value = '';
Page(Object.assign({}, utils.TopTips, {
  data: {
    images: []
  },
  onLoad: function (options) {

  },
  inputChange: function (event) {
    value = event.detail.value;
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var imgs = that.data.images.concat(tempFilePaths);
        if (imgs.length > 9) imgs = imgs.slice(0, 9);
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
  submit: function () {
    var that = this;
    if (!value) {
      this.showZanTopTips('美图标题不能为空！');
      return;
    }
    if (!this.data.images.length) {
      this.showZanTopTips('您还没有选择要发布的美图哦！');
      return;
    }
    wx.showLoading({ title: "上传中...", mask: true });

    albumApi.createAlbum(that.data.images, value).then(res => {
      console.log(res);
      wx.hideLoading();
      wx.navigateBack();
    }).catch(res => {
      wx.hideLoading();
      that.showZanTopTips(res.errMsg);
    });
  }
}));