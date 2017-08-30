import { BloomFilter }  from "bloomfilter";
import Queue            from "queue-promise";
import getLink          from "get-link";

export default {
    cache : new BloomFilter( 16 * 64 * 256, 17 ),

    queue : null,

    start() {
        this.queue = new Queue( {
            concurrency : this.opts.concurrency,
            interval    : this.opts.interval
        } );

        this.handle( this.base )()
            .then( () => {
                this.queue.on( "start", () => this.emit( "start" ) );
                this.queue.on( "stop", () => this.emit( "stop" ) );
                this.queue.on( "tick", () => this.emit( "tick" ) );
                this.queue.on( "resolve", e => this.emit( "request", e ) );
                this.queue.on( "reject", e => this.emit( "error", e ) );

                this.queue.start();
            } )
            .catch( ( error ) => {
                this.emit( "error", error );
            } );
    },

    parse( req, res ) {
        res.get( "a" ).each( ( i, url ) => {
            const href = res.get( url ).attr( "href" );
            const link = getLink( this.base, href );

            if ( link && !this.cache.test( link ) ) {
                const extracted = this.handle( link );

                if ( extracted ) {
                    this.cache.add( link );
                    this.queue.add( extracted );
                }
            }
        } );
    },

    handle( url ) {
        return () => {
            return new Promise( ( resolve, reject ) => {
                this.request( url, ( req, res ) => {
                    try {
                        this.check( url, req, res );
                        this.parse( req, res );
                    } catch ( error ) {
                        reject( url );
                    }

                    resolve( url );
                }, reject );
            } );
        };
    }
};
