"use strict";
var request = require('request.js');
var baseUrl = getApp().globalData.gateway;


module.exports = {
  "get": function (resource, query = {}) {
    return request.get(baseUrl + resource, query);
  },
  "post": function (resource, query = {}, data = {}) {
    return request.post(baseUrl + resource, query, data);
  },
  "put": function (resource, query = {}, data = {}) {
    return request.put(baseUrl + resource, query, data);
  },
  "delete": function (resource, query = {}, data = {}) {
    return request.delete(baseUrl + resource, query, data);
  },
  "upload": function (filePath, sign) {
    return request.upload(filePath, sign);
  }
}