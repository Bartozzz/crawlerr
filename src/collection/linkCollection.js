"use strict";

const BasicCollection = require( "basic-collection" );

/**
 * Link data collection.
 *
 * @author    Łaniewski Bartosz <laniewski.bartozzz@gmail.com> (//laniewski.me)
 * @copyright Copyright (c) 2016 Łaniewski Bartosz
 * @license   MIT
 */

class LinkCollection extends BasicCollection {
    /**
     * Create a new `Collection` instance with optionally injected parameters.
     *
     * @param   array   parameters
     * @access  public
     */
    constructor( parameters ) {
        super( parameters );

        this.index = 0;
    }

    /**
     * Normalize data key.
     *
     * @param   string  key
     * @return  mixed   The transformed/normalized data key
     * @access  private
     */
    normalize( key ) {
        return new String( key ).replace( /\/$/g, "" );
    }

    /**
     * Set an attribute for the current collection. If the attribute name
     * already exists, its value will be overwritten.
     *
     * @param   string  key
     * @param   mixed   value
     * @access  private
     */
    set( key, value ) {
        super.set( key, this.index++ );
    }

    /**
     * Filters links.
     *
     * @param   string      pattern
     * @param   function    callback
     * @throws  Callback must be a function
     * @access  public
     */
    filter( pattern, callback ) {
        if ( typeof callback !== "function" ) {
            throw new Error( `Callback must be a function. Got ${typeof callback}.` );
        }

        callback(
            super.filterByKey( pattern )
        );
    }
};

module.exports = LinkCollection;
