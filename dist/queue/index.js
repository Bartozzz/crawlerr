"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _bloomfilter = require("bloomfilter");

var _retryRequest = require("retry-request");

var _retryRequest2 = _interopRequireDefault(_retryRequest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * Parsed urls are cached using Bloom filter.
     *
     * @see     https://en.wikipedia.org/wiki/Bloom_filter
     * @see     https://hur.st/bloomfilter?n=10000&p=1.0E-5
     * @type    {BloomFilter}
     */
    cache: new _bloomfilter.BloomFilter(16 * 64 * 256, 17),

    /**
     * Queue object.
     *
     * @type    {Queue}
     */
    queue: null,

    init: function init() {
        throw "Not implemented";
    },
    parse: function parse(req, res) {
        throw "Not implemented";
    },
    handle: function handle(uri) {
        throw "Not implemented";
    },
    request: function request(uri, resolve, reject) {
        var _this = this;

        if (!uri.startsWith(this.base)) uri = _url2.default.resolve(this.base, uri);

        (0, _retryRequest2.default)(uri, function (error, response) {
            if (error || response.statusCode != 200) {
                reject(error || uri);
            }

            var req = {};
            var res = response;

            // Set circular references:
            res.req = req;
            req.res = res;

            // Alter the prototypes:
            req.__proto__ = _this.req;
            res.__proto__ = _this.res;

            resolve(req, res);
        });
    }
};
module.exports = exports["default"];