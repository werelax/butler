'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (req, res, next) {
    res.setHeader('Server', 'Zab');
    next();
  };
};