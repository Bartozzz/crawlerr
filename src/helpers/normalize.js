"use strict";

/**
 * Normalizes an url.
 *
 * @param   {string}    url
 * @return  {string}
 */

module.exports = function ( value ) {
    return value
        .trim()
        .replace( /\/$/, "" );
};
