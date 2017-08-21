var api = require("../restapi.js");
var Promise = require("../promise.js").Promise;

module.exports = {
  getAlbums: () => {
    return api.get("/api/author/getTinyAlbumModule");
  },
  getAlbumPhotos: albumId => {
    return api.get("/api/author/getAlbumItems", { albumId: albumId });
  },
  getAlbumCommend: id => {
    return api.get("/api/author/getArticleCommend", { articleId: id });
  },
  getAlbumComments: id => {
    return api.get("/api/author/getArticleComments", { articleId: id });
  },
  commendAlbum: data => {
    return api.post("/api/author/setCommend", null, data);
  },
  commendPhoto: data => {
    return api.post("/api/author/setCommend", null, data);
  },
  comment: data => {
    return api.post("/api/author/comment", null, Object.assign({ relationType: 2 }, data));
  },
  createAlbum: (images, title) => {
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
          return "/vizcaya/"+arr[arr.length - 1];
        });
        console.log(imgs);
        return api.post("/api/author/addAlbum", null, { imgs: imgs.toString(), title: title });
      });
  }
}