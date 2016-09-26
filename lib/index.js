'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _serveStatic = require('serve-static');

var _serveStatic2 = _interopRequireDefault(_serveStatic);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _hsr = require('./utils/hsr');

var _config3 = require('./middleware/config');

var _config4 = _interopRequireDefault(_config3);

var _meta = require('./middleware/meta');

var _meta2 = _interopRequireDefault(_meta);

var _headers = require('./middleware/headers');

var _headers2 = _interopRequireDefault(_headers);

var _redirects = require('./middleware/redirects');

var _redirects2 = _interopRequireDefault(_redirects);

var _cleanUrls = require('./middleware/clean-urls');

var _cleanUrls2 = _interopRequireDefault(_cleanUrls);

var _ssl = require('./middleware/ssl');

var _ssl2 = _interopRequireDefault(_ssl);

var _proxies = require('./middleware/proxies');

var _proxies2 = _interopRequireDefault(_proxies);

var _routes = require('./middleware/routes');

var _routes2 = _interopRequireDefault(_routes);

var _notFound = require('./middleware/not-found');

var _notFound2 = _interopRequireDefault(_notFound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(userConfig) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var config, app, hsr, uri, returnObj;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _config2.default)(userConfig);

          case 2:
            config = _context.sent;
            app = (0, _express2.default)();

            app.disable('x-powered-by');

            app.use((0, _compression2.default)());
            app.use((0, _helmet2.default)());
            app.use((0, _cors2.default)());

            app.use((0, _config4.default)(config));
            app.use((0, _proxies2.default)());

            if (!opts.hsr) {
              _context.next = 16;
              break;
            }

            _context.next = 13;
            return (0, _hsr.enableHsr)(app);

          case 13:
            _context.t0 = _context.sent;
            _context.next = 17;
            break;

          case 16:
            _context.t0 = null;

          case 17:
            hsr = _context.t0;

            app.use((0, _meta2.default)());
            app.use((0, _headers2.default)());
            app.use((0, _redirects2.default)());
            app.use((0, _cleanUrls2.default)());
            app.use((0, _ssl2.default)());
            app.use((0, _routes2.default)());

            app.use((0, _serveStatic2.default)(config.root));
            app.use((0, _notFound2.default)());

            uri = 'http://' + config.host + ':' + config.port;
            _context.next = 29;
            return new _promise2.default(function (resolve, reject) {
              app.listen(config.port, config.host, function (err) {
                if (err) reject(err);else resolve();
              });
            });

          case 29:
            returnObj = { uri: uri, config: config };

            if (hsr) returnObj.hsr = hsr;

            return _context.abrupt('return', returnObj);

          case 32:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();