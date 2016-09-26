#!/usr/bin/env node
'use strict';

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (undefined === 'development') {
  require('source-map-support').install();
}

(0, _2.default)().then(function (res) {
  return console.log('running at', res.uri);
});