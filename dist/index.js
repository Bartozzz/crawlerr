"use strict";

var _mergeDescriptors = _interopRequireDefault(require("merge-descriptors"));

var _request = _interopRequireDefault(require("request"));

var _events = _interopRequireDefault(require("events"));

var _setprototypeof = _interopRequireDefault(require("setprototypeof"));

var _promise = _interopRequireDefault(require("./queue/promise"));

var _router = _interopRequireDefault(require("./routing/router"));

var _request2 = _interopRequireDefault(require("./routing/request"));

var _response = _interopRequireDefault(require("./routing/response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param  {string}     base
 * @param  {Object}     options
 * @return {Object}
 */
function createCrawler(base, options = {}) {
  if (typeof base !== "string") {
    throw new Error(`Base must be a string, not ${typeof base}`);
  }

  const config = _objectSpread({
    interval: 250,
    concurrent: 10
  }, options); // Will be used by retry-request:


  const requestJar = _request.default.jar();

  const requestObj = _request.default.defaults(_objectSpread({
    jar: requestJar
  }, config));

  (0, _setprototypeof.default)(requestObj, requestJar); // Crawler base:

  const crawler = {
    base: base,
    opts: config,
    req: _request2.default,
    res: _response.default,
    request: requestObj
  }; // Glues all the components together:

  (0, _mergeDescriptors.default)(crawler, _promise.default, false);
  (0, _mergeDescriptors.default)(crawler, _router.default, false);
  (0, _mergeDescriptors.default)(crawler, _events.default.prototype);
  return crawler;
}

module.exports = createCrawler;
module.exports.request = _request2.default;
module.exports.response = _response.default;