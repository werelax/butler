'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startHsrWebsocket = exports.enableHsr = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var enableHsr = exports.enableHsr = function () {
  var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(app) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            app.use(_bodyParser2.default.json({ limit: '100mb' }));

            app.post('/__hsr__', function (req, res, next) {
              var state = req.body.state;

              var ts = Date.now();

              SAVED_STATES[ts] = state;
              res.json({ ts: ts });
            });

            app.get('/__hsr__/:ts', function (req, res, next) {
              var state = SAVED_STATES[req.params.ts];

              if (!state) res.send();else res.json(state);
            });

            _context.next = 5;
            return startHsrWebsocket();

          case 5:
            return _context.abrupt('return', _context.sent);

          case 6:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function enableHsr(_x) {
    return _ref.apply(this, arguments);
  };
}();

var startHsrWebsocket = exports.startHsrWebsocket = function () {
  var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
    var port, server, WsServer, ws, uri, send;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _common.getFreePort)();

          case 2:
            port = _context2.sent;
            server = _http2.default.createServer();

            server.listen(port, function (err) {
              if (err) return _promise2.default.reject(err);
            });

            WsServer = _websocket2.default.server;
            ws = new WsServer({
              httpServer: server,
              autoAcceptConnections: false
            });


            ws.on('request', function (req) {
              var conn = req.accept('echo-protocol', req.origin);

              CONNECTIONS.add(conn);
              conn.on('close', function () {
                return CONNECTIONS.delete(conn);
              });
            });

            uri = 'ws://localhost:' + port;

            send = function send(msg) {
              var payload = (0, _stringify2.default)(msg);
              CONNECTIONS.forEach(function (c) {
                return c.send(payload);
              });
            };

            return _context2.abrupt('return', { uri: uri, send: send });

          case 11:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function startHsrWebsocket() {
    return _ref2.apply(this, arguments);
  };
}();

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _websocket = require('websocket');

var _websocket2 = _interopRequireDefault(_websocket);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SAVED_STATES = {};
var CONNECTIONS = new _set2.default();