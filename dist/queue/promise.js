"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _bloomfilter = require("bloomfilter");

var _queuePromise = require("queue-promise");

var _queuePromise2 = _interopRequireDefault(_queuePromise);

var _getLink = require("get-link");

var _getLink2 = _interopRequireDefault(_getLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * Parsed urls are cached using Bloom filter.
     *
     * @see     https://en.wikipedia.org/wiki/Bloom_filter
     * @see     https://hur.st/bloomfilter?n=10000&p=1.0E-5
     * @type    {BloomFilter}
     * @access  protected
     */
    cache: new _bloomfilter.BloomFilter(32 * 64 * 128, 17),

    /**
     * Queue object.
     *
     * @type    {Queue}
     * @access  protected
     */
    queue: null,

    /**
     * Creates a new queue and initialises it.
     *
     * @return  {void}
     * @access  public
     */
    start: function start() {
        var _this = this;

        this.queue = new _queuePromise2.default({
            concurrency: this.opts.concurrency,
            interval: this.opts.interval
        });

        this.handle(this.base)().then(function () {
            _this.queue.on("start", function () {
                return _this.emit("start");
            });
            _this.queue.on("stop", function () {
                return _this.emit("stop");
            });
            _this.queue.on("tick", function () {
                return _this.emit("tick");
            });
            _this.queue.on("resolve", function (e) {
                return _this.emit("request", e);
            });
            _this.queue.on("reject", function (e) {
                return _this.emit("error", e);
            });

            _this.queue.start();
        }).catch(function (error) {
            _this.emit("error", error);
        });
    },


    /**
     * Searches for new links from response and adds those to the queue.
     *
     * @param   {Request}   req
     * @param   {Response}  res
     * @access  protected
     */
    parse: function parse(req, res) {
        var _this2 = this;

        res.get("a").each(function (i, url) {
            var href = res.get(url).attr("href");
            var link = (0, _getLink2.default)(_this2.base, href);

            if (link && !_this2.cache.test(link)) {
                var extracted = _this2.handle(link);

                if (extracted) {
                    _this2.cache.add(link);
                    _this2.queue.add(extracted);
                }
            }
        });
    },


    /**
     * Handles a given url:
     * - executes a callback if it matches any registered wildcard;
     * - parses its content for new links;
     *
     * @param   {string}    url
     * @return  {Promise}
     * @access  protected
     */
    handle: function handle(url) {
        var _this3 = this;

        return function () {
            return new _promise2.default(function (resolve, reject) {
                _this3.get(url).then(function (_ref) {
                    var req = _ref.req,
                        res = _ref.res;

                    try {
                        _this3.check(url, req, res);
                        _this3.parse(req, res);
                    } catch (error) {
                        reject(error);
                    }

                    resolve(url);
                }).catch(reject);
            });
        };
    }
};
module.exports = exports["default"];