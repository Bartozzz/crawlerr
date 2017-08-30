"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _wildcardNamed = require("wildcard-named");

var _wildcardNamed2 = _interopRequireDefault(_wildcardNamed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    crawling: false,
    callbacks: {},

    when: function when(uri, callback) {
        var _this = this;

        if (!this.crawling) {
            this.crawling = true;

            // Deffer:
            setTimeout(function () {
                return _this.init();
            }, 0);
        }

        this.add(uri, callback);
    },
    add: function add(uri, callback) {
        var href = _url2.default.resolve(this.base, uri);
        var resp = callback;

        this.callbacks[href] = resp;
    },
    check: function check(uri, req, res) {
        for (var index in this.callbacks) {
            var requested = (0, _wildcardNamed2.default)(uri, index);
            var callback = this.callbacks[index];

            if (uri === index || requested) {
                (0, _mergeDescriptors2.default)(req.params, requested || {});
                callback(req, res, uri);
            }
        }
    }
};
module.exports = exports["default"];