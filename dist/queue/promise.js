"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _queuePromise = require("queue-promise");

var _queuePromise2 = _interopRequireDefault(_queuePromise);

var _getLink = require("get-link");

var _getLink2 = _interopRequireDefault(_getLink);

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _mergeDescriptors2.default)(_index2.default, {
    init: function init() {
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
    parse: function parse(req, res) {
        var _this2 = this;

        res.get("a").each(function (i, url) {
            var href = res.get(url).attr("href");
            var link = (0, _getLink2.default)(_this2.base, href);

            if (link && !_this2.links.test(link)) {
                var extracted = _this2.handle(link);

                if (extracted) {
                    _this2.links.add(link);
                    _this2.queue.add(extracted);
                }
            }
        });
    },
    handle: function handle(url) {
        var _this3 = this;

        return function () {
            return new _promise2.default(function (resolve, reject) {
                _this3.request(url, function (req, res) {
                    try {
                        _this3.check(url, req, res);
                        _this3.parse(req, res);
                    } catch (error) {
                        reject(url);
                    }

                    resolve(url);
                }, reject);
            });
        };
    }
});
module.exports = exports["default"];