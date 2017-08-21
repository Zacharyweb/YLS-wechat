// pages/home/comment.js
var utils = require("../../utils/util.js");
var articleApi = require("../../utils/data/article.js");
Page({
  data: {
    coments: [
      
    ]
  },
  onLoad: function (options) {
    var that=this;
    articleApi.getMyComments().then(function(res){
       that.setData({ coments: res.data.data });
    })  
  }
})