"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require("url");

var _url2 = _interopRequireDefault(_url);

var _retryRequest = require("retry-request");

var _retryRequest2 = _interopRequireDefault(_retryRequest);

var _mergeDescriptors = require("merge-descriptors");

var _mergeDescriptors2 = _interopRequireDefault(_mergeDescriptors);

var _wildcardNamed = require("wildcard-named");

var _wildcardNamed2 = _interopRequireDefault(_wildcardNamed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
     * @return  {Promise}
     * @access  public
     */
    when: function when(uri) {
        var _this = this;

        return new Promise(function (resolve) {
            _this.callbacks[_url2.default.resolve(_this.base, uri)] = resolve;
        });
    },


    /**
     * Requests a single uri.
     *
     * @param   {string}    uri
     * @return  {Promise}
     * @access  public
     */
    get: function get(uri) {
        var _this2 = this;

        if (!uri.startsWith(this.base)) {
            uri = _url2.default.resolve(this.base, uri);
        }

        return new Promise(function (resolve, reject) {
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
                req.__proto__ = _this2.req;
                res.__proto__ = _this2.res;

                resolve({ req: req, res: res, uri: uri });
            });
        });
    },


    /**
     * Checks whenever an uri matches the registered callbacks and eventually
     * executes the callback.
     *
     * @param   {string}    uri
     * @param   {Request}   req
     * @param   {Response}  res
     * @return  {void}
     * @access  protected
     */
    check: function check(uri, req, res) {
        for (var index in this.callbacks) {
            var requested = (0, _wildcardNamed2.default)(uri, index);
            var callback = this.callbacks[index];

            if (uri === index || requested) {
                // Merge request parameters with wildcard output:
                (0, _mergeDescriptors2.default)(req.params, requested || {});

                callback({ req: req, res: res, uri: uri });
            }
        }
    }
};
module.exports = exports["default"];