import url      from "url";
import request  from "retry-request";
import mixin    from "merge-descriptors";
import wildcard from "wildcard-named";

export default {
    /**
     * Registered callbacks.
     *
     * @type    {object}
     * @access  protected
     */
    callbacks : {},

    /**
     * Add a handler for a specific uri. Accepts wildcards.
     *
     * @param   {string}    uri
     * @return  {Promise}
     * @access  public
     */
    when( uri ) {
        return new Promise( resolve => {
            this.callbacks[ url.resolve( this.base, uri ) ] = resolve;
        } );
    },

    /**
     * Requests a single uri.
     *
     * @param   {string}    uri
     * @return  {Promise}
     * @access  public
     */
    get( uri ) {
        if ( !uri.startsWith( this.base ) ) {
            uri = url.resolve( this.base, uri );
        }

        return new Promise( ( resolve, reject ) => {
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

                resolve( { req, res, uri } );
            } );
        } );
    },

    /**
     * Checks whenever an uri matches the registered callbacks and eventually
     * executes the callback.
     *
     * @param   {string}    uri
     * @param   {Request}   req
     * @param   {Response}  res
     * @return  {void}
     * @access  protected
     */
    check( uri, req, res ) {
        for ( const index in this.callbacks ) {
            const requested = wildcard( uri, index );
            const callback  = this.callbacks[ index ];

            if ( uri === index || requested ) {
                // Merge request parameters with wildcard output:
                mixin( req.params, requested || {} );

                callback( { req, res, uri } );
            }
        }
    }
};
