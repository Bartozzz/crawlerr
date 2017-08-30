"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    cheerio: null,

    get: function get(element) {
        if (!this.cheerio) {
            this.cheerio = _cheerio2.default.load(this.body);
        }

        return this.cheerio(element);
    }
};
module.exports = exports["default"];