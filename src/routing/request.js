import http   from "http";
import typeis from "type-is";

export default {
    // Request prototype:
    __proto__ : http.IncomingMessage.prototype,

    /**
     * Returns request header. The `Referrer` header field is special-cased,
     * both `Referrer` and `Referer` are interchangeable.
     *
     * @param   {string}    name
     * @return  {string}
     * @access  public
     */
    get( header ) {
        if ( !header ) {
            throw new TypeError( "Name argument is required to req.get" );
        }

        if ( typeof name !== "string" ) {
            throw new TypeError( "Name must be a string to req.get" );
        }

        const lower = header.toLowerCase();

        switch( lower ) {
            case "referer":
            case "referrer":
                return this.headers.referrer || this.headers.referer;

            default:
                return this.headers[ lower ];
        }
    },

    /**
     * Check if the incoming request contains the "Content-Type" header field,
     * and it contains the give mime `type`.
     *
     * @param   {string|array}      types...
     * @return  {string|false|null}
     * @access  public
     */
    is( ...types ) {
        return typeis( this, types );
    },

    /**
     * Return the value of param `name` when present or `defaultValue`:
     * - checks route placeholders, ex: `user/[all:username]`;
     * - checks body params, ex: `id=12, {"id":12}`;
     * - checks query string params, ex: `?id=12`;
     *
     * @param   {string}    name
     * @param   {mixed}     defaultValue
     * @return  {string}
     * @access  public
     */
    param( name, defaultValue ) {
        const params = this.params || {};
        const body   = this.body   || {};
        const query  = this.query  || {};

        if ( null != params[ name ] ) return params[ name ];
        if ( null != query[ name ] )  return query[ name ];
        if ( null != body[ name ] )   return body[ name ];

        return defaultValue;
    }
};
