'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var cleanUrls = req.config.cleanUrls;

    if (!cleanUrls) return next();

    if (req.url.match(/\/index(\.html)?$/)) {
      var newUrl = req.url.substring(0, req.url.lastIndexOf('/index'));
      return (0, _redirects.redirect)(res, newUrl || '/');
    }

    if (_path2.default.extname(req.url) === '.html') {
      var _newUrl = req.url.replace(/\.html$/, '');
      return (0, _redirects.redirect)(res, _newUrl);
    }

    next();
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _redirects = require('./redirects');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }