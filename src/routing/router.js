import url      from "url";
import mixin    from "merge-descriptors";
import wildcard from "wildcard-named";

export default {
    callbacks : {},

    when( uri ) {
        return new Promise( resolve => {
            this.callbacks[ url.resolve( this.base, uri ) ] = resolve;
        } );
    },

    check( uri, req, res ) {
        for ( const index in this.callbacks ) {
            const requested = wildcard( uri, index );
            const callback  = this.callbacks[ index ];

            if ( uri === index || requested ) {
                mixin( req.params, requested || {} );

                callback( { req, res, uri } );
            }
        }
    }
};
