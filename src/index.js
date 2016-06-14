"use strict";

const http           = require( "http" );
const mixin          = require( "merge-descriptors" );
const EventEmitter   = require( "events" ).prototype;
const SpiderQueue    = require( "./queue/promise" );
const SpiderRouter   = require( "./routing/router" );
const SpiderRequest  = require( "./routing/request" );
const SpiderResponse = require( "./routing/response" );

function createCrawler( base, options ) {
    if ( typeof base !== "string" ) {
        throw new Error( `Base must be a string, not ${typeof base}` );
    }

    options             = options             || {}
    options.queue       = options.queue       || SpiderQueue;
    options.interval    = options.interval    || 250;
    options.concurrency = options.concurrency || 10;

    const crawler = {
        base : base,
        opts : options,
        req  : SpiderRequest,
        res  : SpiderResponse
    };

    mixin( crawler, options.queue, false );
    mixin( crawler, SpiderRouter, false );
    mixin( crawler, EventEmitter, false );

    return crawler;
};

module.exports          = createCrawler;
module.exports.request  = SpiderRequest;
module.exports.response = SpiderResponse;
