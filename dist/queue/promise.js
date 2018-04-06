"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bloomfilter = require("bloomfilter");

var _queuePromise = require("queue-promise");

var _queuePromise2 = _interopRequireDefault(_queuePromise);

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
   * Creates a new queue and initialises it. Re-emits queue events in crawler.
   *
   * @return  {void}
   * @access  public
   */
  start: function start() {
    var _this = this;

    this.queue = new _queuePromise2.default({
      concurrent: this.opts.concurrent,
      interval: this.opts.interval,
      start: false
    });

    this.queue.on("start", function () {
      return _this.emit("start");
    });
    this.queue.on("stop", function () {
      return _this.emit("stop");
    });
    this.queue.on("resolve", function (e) {
      return _this.emit("request", e);
    });
    this.queue.on("reject", function (e) {
      return _this.emit("error", e);
    });
    this.queue.start();

    this.handle(this.base)().catch(function (error) {
      _this.emit("error", error);
    });
  },


  /**
   * Stops the queue if it is running.
   *
   * @return  {void}
   * @access  public
   */
  stop: function stop() {
    if (this.queue && this.queue.started) {
      this.queue.stop();
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
            _this2.callActions(url, req, res);
            _this2.parseAnchors(req, res);
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