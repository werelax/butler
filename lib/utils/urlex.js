'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertToGlob = convertToGlob;
exports.parsePlaceholders = parsePlaceholders;
exports.parseUrl = parseUrl;
var urlSplitRegex = /[\/]|(?=\.)/g;

function convertToGlob(str) {
  return str.replace(/(:([^\/]+))/g, '*');
}

function parsePlaceholders(url, src, dst) {
  var vars = src.match(/(:[^\/]+)/g) || [];
  var srcSplit = src.split(urlSplitRegex);
  var urlSplit = url.split(urlSplitRegex);

  var data = {};
  vars.forEach(function (v) {
    var indx = srcSplit.indexOf(v);
    data[v] = urlSplit[indx];
  });

  for (var i in data) {
    dst = dst.replace('' + i, data[i] || 'undefined');
  }

  return dst;
}

function parseUrl(url, src, dst) {
  var withPlaceholders = parsePlaceholders(url, src, dst);

  var match = src.match(/\*\*/);
  var indx = match ? match.index : 0;
  var $1 = url.substring(indx);

  return withPlaceholders.replace('**', $1);
}