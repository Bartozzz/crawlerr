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
     * @param   string  body
     * @access  public
     */
    constructor( data, body ) {
        this.raw  = body;
        this.data = this.setData( data );
        this.html = this.setHtml( body );
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
     * Sets the html body for the current response.
     *
     * @param   string  value
     * @return  object
     * @access  private
     */
    setHtml( value ) {
        return cheerio.load( value );
    }
};

module.exports = Response;
