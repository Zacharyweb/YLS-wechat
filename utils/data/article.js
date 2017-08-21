var api = require("../restapi.js");
var Promise = require("../promise.js").Promise;
var utils = require("../../utils/util.js");

module.exports = {
  getMyComments: function (data) {
    return api.get("/api/author/getMyComments", data);
  },
  getList: function (data, grouped = true) {
    return api.get("/api/author/getTinyArticleList", data).then(function (res) {
      res.data.count = res.data.data.length;
      res.data.data.forEach(function (art) {
        art.img = art.img.split(',')[0];
      });
      if (grouped) {
        var newData = {};
        res.data.data.forEach(function (art) {
          var t = utils.FormatTimeDiff(art.time);
          !newData[t] && (newData[t] = { name: t, articles: [] });
          newData[t].articles.push(art);
        });
        res.data.data = newData;
      }

      return res;
    });
  },
  getArticleCommend: id => {
    return api.get("/api/author/getArticleCommend", { articleId: id });
  },
  getArticleComments: id => {
    return api.get("/api/author/getArticleComments", { articleId: id });
  },
  getArticle: function (id) {
    return Promise.all([
      api.get("/api/author/getArticle", { id: id }).then(res => {
        var arr = res.data.errorMsg.split('|');
        res.data.data.nextid = arr[0];
        res.data.data.previd = arr[1];
        res.data.data.img = !res.data.data.img ? [] : res.data.data.img.split(',');
        return res;
      }),
      api.get("/api/author/getArticleCommend", { articleId: id })
    ]);
  },
  setCommend: function (data) {
    return api.post("/api/author/setCommend", null, data);
  },
  comment: data => {
    return api.post("/api/author/comment", null, Object.assign({ relationType: 1 }, data));
  },
  createArticle: data => {
    if (!data.img || !data.img.length)
      return api.post("/api/author/addArticle", null, data);
    var images = data.img;
    return api.get("/qcloud/getSignature")
      .then(res => {
        var reqs = images.map(function (file) {
          return api.upload(file, res.data.sign);
        });
        return Promise.all(reqs);
      }).then(res => {
        var imgs = res.map(r => {
          return JSON.parse(r.data).data.source_url;
        }).map(r => {
          var arr = r.split("/");
          return "/vizcaya/" + arr[arr.length - 1];
        });
        data.img = imgs.toString();
        return api.post("/api/author/addArticle", null, data);
      });
  }
}