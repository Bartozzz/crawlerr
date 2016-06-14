const crawler = require( "../src/index" );
const spider  = crawler( "http://google.com" );

spider.request( "/", ( req, res ) => {
    console.log( res.get( "title" ).html() )
}, error => {
    console.log( error );
} );
