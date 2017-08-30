"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _events = require("events");

var _promise = require("./queue/promise");

var _promise2 = _interopRequireDefault(_promise);

var _router = require("./routing/router");

var _router2 = _interopRequireDefault(_router);

var _request = require("./routing/request");

var _request2 = _interopRequireDefault(_request);

var _response = require("./routing/response");

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createCrawler(base) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (typeof base !== "string") {
        throw new Error("Base must be a string, not " + (typeof base === "undefined" ? "undefined" : (0, _typeof3.default)(base)));
    }

    var config = (0, _extends3.default)({
        queue: _promise2.default,
        interval: 250,
        concurrency: 10
    }, options);

    var crawler = {
        base: base,
        opts: config,
        req: _request2.default,
        res: _response2.default
    };

    (0, _mergeDescriptors2.default)(crawler, config.queue, false);
    (0, _mergeDescriptors2.default)(crawler, _router2.default, false);
    (0, _mergeDescriptors2.default)(crawler, _events.EventEmitter.prototype, false);

    return crawler;
};

module.exports = createCrawler;
module.exports.request = _request2.default;
module.exports.response = _response2.default;