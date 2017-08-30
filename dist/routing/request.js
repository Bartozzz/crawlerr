"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _typeIs = require("type-is");

var _typeIs2 = _interopRequireDefault(_typeIs);

var _parseurl = require("parseurl");

var _parseurl2 = _interopRequireDefault(_parseurl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    __proto__: _http2.default.IncomingMessage.prototype,

    params: {},
    body: {},
    query: {},

    get: function get(header) {
        var lower = header.toLowerCase();

        switch (lower) {
            case "referer":
            case "referrer":
                return this.headers.referrer || this.headers.referer;

            default:
                return this.headers[lower];
        }
    },
    is: function is() {
        for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
            types[_key] = arguments[_key];
        }

        return (0, _typeIs2.default)(this, types);
    },
    param: function param(name, def) {
        var params = this.params || {};
        var body = this.body || {};
        var query = this.query || {};

        if (null != params[name]) return params[name];
        if (null != query[name]) return query[name];
        if (null != body[name]) return body[name];

        return def;
    }
};
module.exports = exports["default"];