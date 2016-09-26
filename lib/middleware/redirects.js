'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var redirects = req.config.redirects;


    var routeMatched = false;
    redirects.forEach(function (r) {
      if (_micromatch2.default.isMatch(req.url, (0, _urlex.convertToGlob)(r.from))) {
        var newUrl = !r.to.match(/^http/) ? (0, _urlex.parseUrl)(req.url, r.from, r.to) : r.to;

        redirect(res, newUrl, r.type);
        routeMatched = true;

        return false;
      }
    });

    if (!routeMatched) next();
  };
};

exports.redirect = redirect;

var _micromatch = require('micromatch');

var _micromatch2 = _interopRequireDefault(_micromatch);

var _urlex = require('../utils/urlex');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function redirect(res, url) {
  var code = arguments.length <= 2 || arguments[2] === undefined ? 301 : arguments[2];

  res.writeHead(code, {
    'Content-Type': 'text/plain',
    'Location': url
  });

  res.end('Redirecting to ' + url);
}