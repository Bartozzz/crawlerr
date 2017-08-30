"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    /**
     * Returns a cheerio object.
     *
     * @param   {string}    selector
     * @return  {cheerio}
     * @access  public
     */
    get: function get(selector) {
        return this.document(selector);
    },


    /**
     * Loads contents and returns a valid cheerio object.
     *
     * @return  {cheerio}
     * @access  public
     */
    get document() {
        return _cheerio2.default.load(this.body);
    }
};
module.exports = exports["default"];