const crawler = require( "../dist" );
const spider  = crawler( "http://google.com" );

spider.get( "/" )
    .then( ( { req, res, uri } ) => {
        console.log( res.document.title );
    } )
    .catch( error => {
        console.log( error );
    } );
