'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    var forceSSL = req.config.forceSSL;


    if (forceSSL && !req.connection.encrypted) {
      var newUrl = 'https://' + req.headers.host + req.url;
      return (0, _redirects2.default)(res, newUrl);
    }

    next();
  };
};

var _redirects = require('./redirects');

var _redirects2 = _interopRequireDefault(_redirects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }