"use strict";

const Queue  = require( "./../src/queue" );
const Colors = require( "colors" );

const Qu = new Queue( {
    concurrency : 2,
    interval    : 1000
} );

Qu.on( "start",   ()            => console.log( `Start event`.yellow ) );
Qu.on( "tick",    ()            => console.log( `---- Tick ----`.gray ) );
Qu.on( "end",     ()            => console.log( `End event`.yellow ) );
Qu.on( "request", ( output )    => console.log( `[S] Request: ${output}`.green ) );
Qu.on( "error",   ( error )     => console.log( `[F] Request: ${error}`.red ) );

Qu.set( () => new Promise( ( resolve, reject ) => resolve( 0 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 1 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => reject( 2 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 3 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 4 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 5 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 6 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 7 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 8 ) ) );
Qu.set( () => new Promise( ( resolve, reject ) => resolve( 9 ) ) );

Qu.start();
