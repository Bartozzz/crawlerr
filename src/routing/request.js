import http   from "http";
import typeis from "type-is";

export default {
    __proto__ : http.IncomingMessage.prototype,

    params : {},
    body   : {},
    query  : {},

    get( header ) {
        const lower = header.toLowerCase();

        switch( lower ) {
            case "referer":
            case "referrer":
                return this.headers.referrer || this.headers.referer;

            default:
                return this.headers[ lower ];
        }
    },

    is( ...types ) {
        return typeis( this, types );
    },

    param( name, def ) {
        const params = this.params || {};
        const body   = this.body   || {};
        const query  = this.query  || {};

        if ( null != params[ name ] ) return params[ name ];
        if ( null != query[ name ] )  return query[ name ];
        if ( null != body[ name ] )   return body[ name ];

        return def;
    }
};
