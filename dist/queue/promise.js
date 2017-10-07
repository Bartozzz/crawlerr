"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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
     * Handles a given url:
     * - executes a callback if it matches any registered wildcard;
     * - parses its content for new links;
     *
     * @param   {string}    url
     * @return  {function}
     * @access  protected
     */
    handle: function handle(url) {
        var _this2 = this;

        return function () {
            return new Promise(function (resolve, reject) {
                _this2.get(url).then(function (_ref) {
                    var req = _ref.req,
                        res = _ref.res;

                    try {
                        _this2.check(url, req, res);
                        _this2.parse(req, res);
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