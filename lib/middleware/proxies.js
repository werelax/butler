'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var proxies = req.config.proxies;


    var routeMatched = false;
    proxies.forEach(function (p) {
      if (_micromatch2.default.isMatch(req.url, (0, _urlex.convertToGlob)(p.src))) {
        routeMatched = true;

        var newUrl = (0, _urlex.parseUrl)(req.url, p.src, p.dest);
        var parsed = _url2.default.parse(newUrl);

        req.url = parsed.path;

        proxyServer.on('error', next);
        proxyServer.web(req, res, {
          target: parsed.protocol + '//' + parsed.host
        }, next);
      }
    });

    if (!routeMatched) next();
  };
};

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _micromatch = require('micromatch');

var _micromatch2 = _interopRequireDefault(_micromatch);

var _urlex = require('../utils/urlex');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxyServer = _httpProxy2.default.createProxyServer({
  changeOrigin: true,
  toProxy: true
});