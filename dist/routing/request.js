"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _http = _interopRequireDefault(require("http"));

var _typeIs = _interopRequireDefault(require("type-is"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const req = Object.create(_http.default.IncomingMessage.prototype);
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
    throw new TypeError(`req.get takes a string as argument, got ${typeof header}`);
  }

  const lower = header.toLowerCase();

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


req.is = function (...types) {
  return (0, _typeIs.default)(this, types);
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
  const params = this.params || {};
  const query = this.query || {};
  const body = this.body || {};
  if (params[name] != null) return params[name];
  if (query[name] != null) return query[name];
  if (body[name] != null) return body[name];
  return defaultValue;
};

var _default = req;
exports.default = _default;
module.exports = exports.default;