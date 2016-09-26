'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    res.statusCode = 404;

    var assetsDir = _path2.default.resolve(__dirname, '../../assets');

    req.url = _config.CONFIG.errorPage ? _config.CONFIG.errorPage : '/not-found.html';
    (0, _serveStatic2.default)(_config.CONFIG.errorPage ? _config.CONFIG.root : assetsDir)(req, res, next);
  };
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _config = require('../config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }