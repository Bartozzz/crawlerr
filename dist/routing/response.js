"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * Parsed response content.
     *
     * @type    {cheerio}
     */
    document: null,

    /**
     * Returns a cheerio object.
     *
     * @param   {string}    selector
     * @return  {cheerio}
     */
    get: function get(selector) {
        if (!this.document) {
            this.document = _cheerio2.default.load(this.body);
        }

        return this.document(selector);
    }
};
module.exports = exports["default"];