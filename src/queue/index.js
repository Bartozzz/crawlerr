import url              from "url";
import { BloomFilter }  from "bloomfilter";
import request          from "retry-request";

export default {
    links : new BloomFilter( 64 * 256, 16 ),
    queue : null,

    init() {
        throw "Not implemented";
    },

    parse( req, res ) {
        throw "Not implemented";
    },

    handle( uri ) {
        throw "Not implemented";
    },

    request( uri, resolve, reject ) {
        if ( !uri.startsWith( this.base ) )
            uri = url.resolve( this.base, uri );

        request( uri, ( error, response ) => {
            if ( error || response.statusCode != 200 ) {
                reject( error || uri );
            }

            const req = {};
            const res = response;

            // Set circular references:
            res.req = req;
            req.res = res;

            // Alter the prototypes:
            req.__proto__ = this.req;
            res.__proto__ = this.res;

            resolve( req, res );
        } );
    }
};
