'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.getFreePort = getFreePort;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getFreePort() {
  return new _promise2.default(function (resolve, reject) {
    var server = _net2.default.createServer();

    server.listen(0, function (err) {
      if (err) return reject(err);

      var port = server.address().port;
      server.close(function () {
        return resolve(port);
      });
    });
  });
}