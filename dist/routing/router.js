"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _url = _interopRequireDefault(require("url"));

var _retryRequest = _interopRequireDefault(require("retry-request"));

var _getLink = _interopRequireDefault(require("get-link"));

var _wildcardNamed = _interopRequireDefault(require("wildcard-named"));

var _setprototypeof = _interopRequireDefault(require("setprototypeof"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const defaultOptions = {
  noResponseRetries: 0,
  retries: 1
};
var _default = {
  /**
   * Registered callbacks.
   *
   * @type    {object}
   * @access  protected
   */
  callbacks: {},

  /**
   * Add a handler for a specific uri. Accepts wildcards.
   *
   * @param   {string}    uri
   * @param   {Function}  callback
   * @return  {void}
   * @access  public
   */
  when(uri, callback) {
    this.callbacks[this.normalizeUri(uri)] = callback;
  },

  /**
   * Requests a single uri.
   *
   * @param   {string}    uri
   * @param   {Object}    opts
   * @return  {Promise}
   * @access  public
   */
  get(uri, opts = defaultOptions) {
    uri = this.normalizeUri(uri);
    opts = _objectSpread({}, opts, {
      request: this.request
    });
    return new Promise((resolve, reject) => {
      (0, _retryRequest.default)(uri, opts, (error, response) => {
        if (error || response.statusCode !== 200) {
          return reject(error || uri);
        }

        const req = {};
        const res = response; // Set circular references:

        res.req = req;
        req.res = res; // Alter the prototypes:

        (0, _setprototypeof.default)(req, this.req);
        (0, _setprototypeof.default)(res, this.res);
        resolve({
          req,
          res,
          uri
        });
      });
    });
  },

  /**
   * Resolves a relative URI with base path.
   *
   * @example
   *  normalizeUri("/")         // http://example.com/
   *  normalizeUri("/foo")      // http://example.com/foo
   *  normalizeUri("/bar.php")  // http://example.com/bar.php
   *
   * @param   {string}  uri
   * @return  {string}
   * @param   {Response}  res
   * @access  protected
   */
  normalizeUri(uri) {
    if (!uri.startsWith(this.base)) {
      uri = _url.default.resolve(this.base, uri);
    }

    return uri;
  },

  /**
   * Searches for new links from response and adds those to the queue.
   *
   * @param   {Request}   req
   * @param   {Response}  res
   * @access  protected
   */
  parseAnchors(req, res) {
    const document = res.document;
    const as = document.getElementsByTagName("a");

    for (const a of as) {
      const href = a.getAttribute("href");
      const link = (0, _getLink.default)(this.base, href);

      if (link && !this.cache.test(link)) {
        this.cache.add(link);
        this.queue.add(this.handle(link));
      }
    }
  },

  /**
   * Checks whenever an uri matches registered callbacks and eventually executes
   * them. Populates the request with retreived parameters from URI.
   *
   * @param   {string}    uri
   * @param   {Request}   req
   * @param   {Response}  res
   * @return  {void}
   * @access  protected
   */
  callActions(uri, req, res) {
    for (const index in this.callbacks) {
      const parameters = (0, _wildcardNamed.default)(uri, index);
      const callback = this.callbacks[index];

      if (uri === index || parameters) {
        // Merge request parameters with wildcard output:
        // NOTE: pheraps we should override params on each callback?
        req.params = _objectSpread({}, req.params, parameters); // mixin(req.params || {}, parameters || {});

        callback({
          req,
          res,
          uri
        });
      }
    }
  }

};
exports.default = _default;
module.exports = exports.default;