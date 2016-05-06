"use strict";

const EventEmitter   = require( "event-emitter" );
const getLink        = require( "get-link" );
const colors         = require( "colors" );
const extend         = require( "extend.js" );

const LinkCollection = require( "./collection/linkCollection" );
const Response       = require( "./router/response" );
const Request        = require( "./router/request" );
const Queue          = require( "./queue" );

/**
 * Sitemap class.
 *
 * @author    Łaniewski Bartosz <laniewski.bartozzz@gmail.com> (//laniewski.me)
 * @copyright Copyright (c) 2016 Łaniewski Bartosz
 * @license   MIT
 */

class Sitemap {
    /**
     * Create a new `Sitemap` instance for a website with optionally injected
     * options.
     *
     * @param   string  website
     * @param   object  options
     * @param   int     options.concurrency
     * @param   int     options.interval
     * @param   bool    options.auto
     * @access  public
     */
    constructor( website, options ) {
        this.options = extend( {
            concurrency : 10,
            interval    : 200,
            verbose     : true,
            ignored     : [],
            auto        : true
        }, options );

        console.log( this.options.ignored )

        this.base  = website;
        this.index = 1;

        this.events = new EventEmitter;
        this.links  = new LinkCollection;
        this.queue  = new Queue( this.options );

        this.queue.on( "start", () => this.events.emit( "start" ) );
        this.queue.on( "end",   () => this.events.emit( "end", this.links ) );

        if ( this.options.verbose ) {
            this.verbose();
        }

        if ( this.options.auto ) {
            this.start();
        }
    }

    /**
     *
     */
    verbose() {
        this.queue.on( "start", () => console.log( `Crawling ${this.base} \n`.gray ) );
        this.queue.on( "end",   () => console.log( `\n Crawling complete`.gray ) );

        this.queue.on( "error", ( message, output ) => {
            output  = `[${this.index++}/${this.links.size}]`.green;
            output += ` ${message}`.red;

            console.log( output );
        } );

        this.queue.on( "request", ( url, output ) => {
            output  = `[${this.index++}/${this.links.size}]`.green;
            output += ` ${url}`.grey.replace( this.base, "" );

            console.log( output );
        } );
    }

    /**
     * Starts scanning the specified website.
     *
     * @access  public
     */
    start() {
        this.extract( this.base )()
            .then( () => {
                this.queue.start();
            } )
            .catch( ( error ) => {
                console.log( `Error in queue:`.red );
                console.log( new String( error ).red );
            } );
    }

    isIgnored( url ) {
        for ( let index in this.options.ignored ) {
            let ignored = this.options.ignored[ index ];

            if ( url.startsWith( ignored ) ) {
                return true;
            }
        }

        return false;
    }

    /**
     * Requests a `url`, parses its content for other, unknown links from the
     * same domain.
     *
     * @param   string      url
     * @return  function
     * @access  private
     */
    extract( url ) {
        if ( this.isIgnored( url ) ) {
            return false;
        }

        return () => {
            return new Request( url, ( response ) => {
                let $    = response.body;
                let data = response.data;

                $( "a" ).each( ( i, url ) => {
                    let href = $( url ).attr( "href" );
                    let link = getLink( this.base, href );

                    if ( link && ! this.links.has( link ) ) {
                        let extracted = this.extract( link );

                        if ( extracted ) {
                            this.links.set( link );
                            this.queue.set( extracted );
                        }
                    }
                } );
            } );
        }
    }

    /**
     * Sets a `callback` for an `event`.
     *
     * @param   event       Event name
     * @param   callback    Event callback
     * @access  public
     */
    on( event, callback ) {
        this.events.on( event, callback );
    }
};

module.exports = Sitemap;
