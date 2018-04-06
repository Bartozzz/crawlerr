"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsdom = require("jsdom");

exports.default = {
  get jsdom() {
    return new _jsdom.JSDOM(this.body);
  },

  get window() {
    return this.jsdom.window;
  },

  get document() {
    return this.window.document;
  }
};
module.exports = exports["default"];