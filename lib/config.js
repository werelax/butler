'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONFIG = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsPromise = require('fs-promise');

var _fsPromise2 = _interopRequireDefault(_fsPromise);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONFIG = exports.CONFIG = void 0;
var defaults = {
  root: 'dist',
  port: parseInt(undefined, 10) || 8000,
  host: undefined || '0.0.0.0',
  errorPage: false,
  cleanUrls: true,
  pushState: false,
  forceSSL: false,
  redirects: [],
  proxies: [],
  routes: [],
  headers: []
};

exports.default = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
    var userConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var configFile, configFromFile, config;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            configFile = _path2.default.resolve('butler.config.js');
            _context.next = 3;
            return _fsPromise2.default.exists(configFile);

          case 3:
            if (!_context.sent) {
              _context.next = 7;
              break;
            }

            _context.t0 = require(configFile);
            _context.next = 8;
            break;

          case 7:
            _context.t0 = {};

          case 8:
            configFromFile = _context.t0;
            config = _lodash2.default.defaultsDeep({}, userConfig, configFromFile, defaults);

            config.root = _path2.default.resolve(config.root);

            exports.CONFIG = CONFIG = config;
            return _context.abrupt('return', config);

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();