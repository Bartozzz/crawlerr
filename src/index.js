import mixin            from "merge-descriptors";
import { EventEmitter } from "events";
import SpiderQueue      from "./queue/promise";
import SpiderRouter     from "./routing/router";
import SpiderRequest    from "./routing/request";
import SpiderResponse   from "./routing/response";

function createCrawler( base, options = {} ) {
    if ( typeof base !== "string" ) {
        throw new Error( `Base must be a string, not ${typeof base}` );
    }

    const config = {
        queue       : SpiderQueue,
        interval    : 250,
        concurrency : 10,
        ...options
    };

    const crawler = {
        base : base,
        opts : config,
        req  : SpiderRequest,
        res  : SpiderResponse
    };

    mixin( crawler, config.queue, false );
    mixin( crawler, SpiderRouter, false );
    mixin( crawler, EventEmitter.prototype, false );

    return crawler;
}

module.exports          = createCrawler;
module.exports.request  = SpiderRequest;
module.exports.response = SpiderResponse;
