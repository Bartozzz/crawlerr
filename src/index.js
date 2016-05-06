"use strict";

const _         = require( "lodash" );
const extend    = require( "extend.js" );
const Queue     = require( "./queue" );
const Sitemap   = require( "./sitemap" );
const Request   = require( "./router/request" );

/**
 * Crawler class.
 *
 * @author    Łaniewski Bartosz <laniewski.bartozzz@gmail.com> (//laniewski.me)
 * @copyright Copyright (c) 2016 Łaniewski Bartosz
 * @license   MIT
 */

class Crawler {
    /**
     * Creates a new `Crawler` instance with custom options.
     *
     * @param   object  options
     * @param   int     options.concurrency
     * @param   int     options.interval
     * @access  public
     */
    constructor( options ) {
        this.options = extend( {
            concurrency : 10,
            interval    : 250,
            verbose     : true,
            ignored     : [],
            allowed     : []
        }, options );

        this.queue = new Queue( this.options );
    }

    /**
     * Add a link (string) or a bunch to link (array) to the specified list.
     *
     * @param   {string|array}  url
     * @param   {string}        list
     * @return  this
     * @access  protected
     */
    add( url, list ) {
        if ( typeof url === "string" ) {
            this.options[ list ].push( _.trim( url, " /" ) );
        } else if ( Array.isArray( url ) ) {
            this.options[ list ] = this.options[ list ].concat( url.map( v => _.trim( v, " /" ) ) );
        }

        return this;
    }

    /**
     *  Add a link (string) or a bunch to link (array) to the ignored list.
     *
     * @param   {string|array}  url
     * @return  this
     * @access  public
     */
    ignore( url ) {
        return this.add( url, "ignored" );
    }

    /**
     *  Add a link (string) or a bunch to link (array) to the allowed list.
     *
     * @param   {string|array}  url
     * @return  this
     * @access  public
     */
    allow( url ) {
        return this.add( url, "allowed" );
    }

    /**
     * Automatically starts the queue. Requests a `url` and executes the
     * specified `callback`.
     *
     * @async
     * @param   string      url
     * @param   function    callback
     * @access  public
     */
    get( url, callback ) {
        this.queue.start();
        this.queue.set( () => new Request( url, ( res ) => callback( res ) ) );
    }

    /**
     * Scans a `website` and executes a `callback` when the scan is completed.
     *
     * @async
     * @param   string      website
     * @param   function    callback
     * @access  public
     */
    scan( website, callback ) {
        this.allow( website );

        let scanner = new Sitemap( website, this.options );

        scanner.on( "end", links => callback( links ) );
    }
};

module.exports = Crawler;
