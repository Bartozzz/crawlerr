"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _typeIs = require("type-is");

var _typeIs2 = _interopRequireDefault(_typeIs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var req = Object.create(_http2.default.IncomingMessage.prototype);

/**
 * Returns request header. The `Referrer` header field is special-cased, both
 * `Referrer` and `Referer` are interchangeable.
 *
 * @param   {string}    header
 * @return  {string}
 * @access  public
 */
req.get = function (header) {
  if (!header || typeof header !== "string") {
    throw new TypeError("req.get takes a string as argument, got " + (typeof header === "undefined" ? "undefined" : _typeof(header)));
  }

  var lower = header.toLowerCase();

  switch (lower) {
    case "referer":
    case "referrer":
      return this.headers.referrer || this.headers.referer;

    default:
      return this.headers[lower];
  }
};

/**
 * Check if the incoming request contains the "Content-Type" header field and it
 * contains the give mime `type`.
 *
 * @param   {string|Array}      types...
 * @return  {string|false}
 * @access  public
 */
req.is = function () {
  for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return (0, _typeIs2.default)(this, types);
};

/**
 * Return the value of param `name` when present or `defaultValue`:
 * - checks route placeholders, ex: `user/[all:username]`;
 * - checks body params, ex: `id=12, {"id":12}`;
 * - checks query string params, ex: `?id=12`;
 *
 * @param   {string}    name
 * @param   {any}       defaultValue
 * @return  {string}
 * @access  public
 */
req.param = function (name, defaultValue) {
  var params = this.params || {};
  var query = this.query || {};
  var body = this.body || {};

  if (params[name] != null) return params[name];
  if (query[name] != null) return query[name];
  if (body[name] != null) return body[name];

  return defaultValue;
};

exports.default = req;
module.exports = exports["default"];