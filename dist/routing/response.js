"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsdom = require("jsdom");

var _default = {
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
exports.default = _default;
module.exports = exports.default;