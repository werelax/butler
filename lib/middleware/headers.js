'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var headers = req.config.headers;


    headers.forEach(function (h) {
      if (h.url && !_micromatch2.default.isMatch(req.url, h.url)) return;
      res.setHeader(h.name, h.value);
    });

    next();
  };
};

var _micromatch = require('micromatch');

var _micromatch2 = _interopRequireDefault(_micromatch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }