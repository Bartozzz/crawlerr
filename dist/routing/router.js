"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _retryRequest = require("retry-request");

var _retryRequest2 = _interopRequireDefault(_retryRequest);

var _getLink = require("get-link");

var _getLink2 = _interopRequireDefault(_getLink);

var _wildcardNamed = require("wildcard-named");

var _wildcardNamed2 = _interopRequireDefault(_wildcardNamed);

var _setprototypeof = require("setprototypeof");

var _setprototypeof2 = _interopRequireDefault(_setprototypeof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  noResponseRetries: 0,
  retries: 1
};

exports.default = {
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
  when: function when(uri, callback) {
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
  get: function get(uri) {
    var _this = this;

    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultOptions;

    uri = this.normalizeUri(uri);
    opts = _extends({}, opts, { request: this.request });

    return new Promise(function (resolve, reject) {
      (0, _retryRequest2.default)(uri, opts, function (error, response) {
        if (error || response.statusCode !== 200) {
          return reject(error || uri);
        }

        var req = {};
        var res = response;

        // Set circular references:
        res.req = req;
        req.res = res;

        // Alter the prototypes:
        (0, _setprototypeof2.default)(req, _this.req);
        (0, _setprototypeof2.default)(res, _this.res);

        resolve({ req: req, res: res, uri: uri });
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
  normalizeUri: function normalizeUri(uri) {
    if (!uri.startsWith(this.base)) {
      uri = _url2.default.resolve(this.base, uri);
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
  parseAnchors: function parseAnchors(req, res) {
    var document = res.document;
    var as = document.getElementsByTagName("a");

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = as[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var a = _step.value;

        var href = a.getAttribute("href");
        var link = (0, _getLink2.default)(this.base, href);

        if (link && !this.cache.test(link)) {
          this.cache.add(link);
          this.queue.add(this.handle(link));
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
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
  callActions: function callActions(uri, req, res) {
    for (var index in this.callbacks) {
      var parameters = (0, _wildcardNamed2.default)(uri, index);
      var callback = this.callbacks[index];

      if (uri === index || parameters) {
        // Merge request parameters with wildcard output:
        // NOTE: pheraps we should override params on each callback?
        req.params = _extends({}, req.params, parameters);
        // mixin(req.params || {}, parameters || {});

        callback({ req: req, res: res, uri: uri });
      }
    }
  }
};
module.exports = exports["default"];