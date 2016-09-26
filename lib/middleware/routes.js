'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var _req$config = req.config;
    var routes = _req$config.routes;
    var cleanUrls = _req$config.cleanUrls;
    var pushState = _req$config.pushState;

    if (!_path2.default.extname(req.url)) {
      routes.forEach(function (r) {
        if (_micromatch2.default.isMatch(req.url, (0, _urlex.convertToGlob)(r.src))) {
          req.url = (0, _urlex.parseUrl)(req.url, r.src, r.dest);
          return false;
        }
      });
    }

    if (cleanUrls && !_path2.default.extname(req.url) && req.url.length > 1) {
      req.url += '.html';
    }

    if (pushState && (!_path2.default.extname(req.url) || _path2.default.extname(req.url) === '.html')) req.url = '/index.html';

    next();
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _micromatch = require('micromatch');

var _micromatch2 = _interopRequireDefault(_micromatch);

var _urlex = require('../utils/urlex');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }