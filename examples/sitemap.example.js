"use strict";

const Sitemap = require( "./../src/sitemap" );
const colors  = require( "colors" );

const Scan = new Sitemap( "http://blog.npmjs.org/", {
    concurrency : 10,
    interval    : 200,
    verbose     : true
} );

Scan.on( "start", function () {
    let output = "";

    output += "Start event...\n".yellow;
    output += "Options".blue;
    output += "- concurrency :".blue + `${A.options.concurrency}`.cyan;
    output += "- interval    : ".blue + `${A.options.interval}`.cyan;
    output += "- verbose     : ".blue + `${A.options.verbose}`.cyan;

    console.log( `${output}\n` );
} );

Scan.on( "end", function ( links ) {
    let output = "";

    output += "\nEnd event...\n".yellow;
    output += "Filtering results for:".blue;
    output += "http://blog.npmjs.org/page/[digit]".cyan.underline;

    console.log( `${output}\n` );

    links.filter( "http://blog.npmjs.org/page/[digit]", function ( results ) {
        console.log( results );
    } );
} );
