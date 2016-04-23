"use strict";

let RequestCollection = require( "./../src/collection/requestCollection" );
let LinkCollection    = require( "./../src/collection/linkCollection" );
let assert            = require( "assert" );

let Ca = new RequestCollection;
let Cb = new LinkCollection;

describe( "Request collection", function () {
    describe( "#set()", function () {
        it( "should add a promise", function () {
            Ca.set( new Promise( ( resolve, reject ) => {} ) );

            assert.equal( "object", typeof Ca.get( 0 ) );
        } );

        it( "should throw an error when the parameter is not a promise", function () {
            assert.throws( () => Ca.set( 113 ), Error );
            assert.throws( () => Ca.set( "a" ), Error );
            assert.throws( () => Ca.set( new Function ), Error );
        } );
    } );
} );

describe( "Url collection", function () {
    describe( "#normalize()", function () {
        it( "should normalize a key", function () {
            assert.equal( "http://test.com", Cb.normalize( "http://test.com/" ) );
            assert.equal( "https://foo.com", Cb.normalize( "https://foo.com/" ) );
            assert.equal( "//www.domai.com", Cb.normalize( "//www.domai.com/" ) );
        } );
    } );

    describe( "#set()", function () {
        it( "should add an element", function () {
            Cb.set( "item_a" );
            Cb.set( "item_b" );
            Cb.set( "item_c" );

            assert.equal( 0, Cb.get( "item_a" ) );
            assert.equal( 1, Cb.get( "item_b" ) );
            assert.equal( 2, Cb.get( "item_c" ) );
        } );
    } );
} );
