"use strict";

const cheerio = require( "cheerio" );

/**
 * Response class.
 *
 * @author    Łaniewski Bartosz <laniewski.bartozzz@gmail.com> (//laniewski.me)
 * @copyright Copyright (c) 2016 Łaniewski Bartosz
 * @license   MIT
 */

class Response {
    /**
     * Creates a new `Response` instance with `data` and `body`.
     *
     * @param   object  data
     * @param   string  html
     * @access  public
     */
    constructor( data, html ) {
        this.data = this.setData( data );
        this.body = this.setBody( html );
    }

    /**
     * Sets the data for the current response.
     *
     * @param   object  value
     * @return  object
     * @access  private
     */
    setData( value ) {
        return value;
    }

    /**
     * Sets the body for the current response.
     *
     * @param   string  value
     * @return  object
     * @access  private
     */
    setBody( value ) {
        return cheerio.load( value );
    }
};

module.exports = Response;
