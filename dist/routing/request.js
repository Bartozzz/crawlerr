"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _typeIs = require("type-is");

var _typeIs2 = _interopRequireDefault(_typeIs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    // Request prototype:
    __proto__: _http2.default.IncomingMessage.prototype,

    /**
     * Returns request header. The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * @param   {string}    header
     * @return  {string}
     * @access  public
     */
    get: function get(header) {
        if (!header) {
            throw new TypeError("Name argument is required to req.get");
        }

        if (typeof name !== "string") {
            throw new TypeError("Name must be a string to req.get");
        }

        var lower = header.toLowerCase();

        switch (lower) {
            case "referer":
            case "referrer":
                return this.headers.referrer || this.headers.referer;

            default:
                return this.headers[lower];
        }
    },


    /**
     * Check if the incoming request contains the "Content-Type" header field,
     * and it contains the give mime `type`.
     *
     * @param   {string|array}      types...
     * @return  {string|false|null}
     * @access  public
     */
    is: function is() {
        for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
            types[_key] = arguments[_key];
        }

        return (0, _typeIs2.default)(this, types);
    },


    /**
     * Return the value of param `name` when present or `defaultValue`:
     * - checks route placeholders, ex: `user/[all:username]`;
     * - checks body params, ex: `id=12, {"id":12}`;
     * - checks query string params, ex: `?id=12`;
     *
     * @param   {string}    name
     * @param   {mixed}     defaultValue
     * @return  {string}
     * @access  public
     */
    param: function param(name, defaultValue) {
        var params = this.params || {};
        var body = this.body || {};
        var query = this.query || {};

        if (null != params[name]) return params[name];
        if (null != query[name]) return query[name];
        if (null != body[name]) return body[name];

        return defaultValue;
    }
};
module.exports = exports["default"];