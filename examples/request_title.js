const crawler = require( "../dist" );
const spider  = crawler( "http://google.com" );

spider.get( "/" )
    .then( ( { req, res, uri } ) => {
        console.log( res.get( "title" ).html() );
    } )
    .catch( error => {
        console.log( error );
    } );
