"use strict";

const Response = require( "./response" );
const request  = require( "request" );
const url      = require( "url" );

/**
 * Request class.
 *
 * @author    Łaniewski Bartosz <laniewski.bartozzz@gmail.com> (//laniewski.me)
 * @copyright Copyright (c) 2016 Łaniewski Bartosz
 * @license   MIT
 */

class Request {
    /**
     * Create a new `Request` instance for a `url`.
     *
     * @param   string      url
     * @param   function    callback
     * @access  public
     */
    constructor( uri, callback ) {
        this.url      = this.setUrl( uri );
        this.callback = this.setCallback( callback );

        return this.send();
    }

    /**
     * Parses a `uri`. If it is malformed, an error will be thrown.
     *
     * @param   string  uri
     * @return  object
     * @access  private
     */
    setUrl( uri ) {
        uri = url.parse( uri );

        if ( ! uri.protocol ) {
            throw new Error( `Unspecified protocol: ${uri.href}` );
        }

        if ( ! uri.hostname ) {
            throw new Error( `Unspecified hostname: ${uri.href}` );
        }

        if ( ! uri.path ) {
            throw new Error( `Unspecified path: ${uri.href}` );
        }

        return uri;
    }

    /**
     * Check if the callback is a function.
     *
     * @param   function    callback
     * @return  function
     * @access  private
     */
    setCallback( callback ) {
        if ( typeof callback !== "function" ) {
            throw new Error( "Callback must be a function" );
        }

        return callback;
    }

    /**
     * Sends the requests. Returns a Promise which resolves to a new `Response`
     * object.
     *
     * @return  Promise
     * @access  public
     */
    send() {
        return new Promise( ( resolve, reject ) => {
            request( this.url.href, ( error, response, body ) => {
                if ( error || response.statusCode != 200 ) {
                    reject( `Can't request ${this.url.href}` );
                }

                try {
                    const content = new Response( response, body );
                    const output  = this.callback( content );

                    resolve( this.url.href, output );
                } catch( error ) {
                    reject( error );
                }
            } );
        } );
    }
};

module.exports = Request;
