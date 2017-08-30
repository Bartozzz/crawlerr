const crawler = require( "../dist" );
const spider  = crawler( "http://blog.npmjs.org/" );

spider.on( "start", () => console.log( "Start event" ) );
spider.on( "error", error => console.log( `[E] ${error}` ) );
spider.on( "request", url => console.log( `[S] ${url}` ) );

spider.when( "/post/[digit:id]/[all:slug]", req => {
    const id   = req.param( "id" );
    const slug = req.param( "slug" ).split( "?" )[ 0 ];

    console.log( `[I] Saving post with id: ${id} (${slug})` );
} );
