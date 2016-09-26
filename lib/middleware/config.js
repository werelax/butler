"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  return function (req, res, next) {
    req.config = config;
    next();
  };
};