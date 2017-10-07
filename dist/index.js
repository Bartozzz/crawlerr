"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _promise = require("./queue/promise");

var _promise2 = _interopRequireDefault(_promise);

var _router = require("./routing/router");

var _router2 = _interopRequireDefault(_router);

var _request = require("./routing/request");

var _request2 = _interopRequireDefault(_request);

var _response = require("./routing/response");

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param  {string}     base
 * @param  {Object}     options
 * @return {Object}
 */
function createCrawler(base) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof base !== "string") {
        throw new Error("Base must be a string, not " + (typeof base === "undefined" ? "undefined" : _typeof(base)));
    }

    var config = _extends({
        interval: 250,
        concurrency: 10
    }, options);

    var crawler = {
        base: base,
        opts: config,
        req: _request2.default,
        res: _response2.default
    };

    // Glues all the components together:
    (0, _mergeDescriptors2.default)(crawler, _promise2.default, false);
    (0, _mergeDescriptors2.default)(crawler, _router2.default, false);
    (0, _mergeDescriptors2.default)(crawler, _events2.default.prototype, false);

    return crawler;
}

module.exports = createCrawler;
module.exports.request = _request2.default;
module.exports.response = _response2.default;