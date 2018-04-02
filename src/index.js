// @flow

import mixin from "merge-descriptors";
import EventEmitter from "events";
import SpiderQueue from "./queue/promise";
import SpiderRouter from "./routing/router";
import SpiderRequest from "./routing/request";
import SpiderResponse from "./routing/response";

/**
 * @param  {string}     base
 * @param  {Object}     options
 * @return {Object}
 */
function createCrawler(base: string, options: Object = {}): Object {
  if (typeof base !== "string") {
    throw new Error(`Base must be a string, not ${typeof base}`);
  }

  const config: Object = {
    interval: 250,
    concurrency: 10,
    ...options
  };

  const crawler: Object = {
    base: base,
    opts: config,
    req: SpiderRequest,
    res: SpiderResponse
  };

  // Glues all the components together:
  mixin(crawler, SpiderQueue, false);
  mixin(crawler, SpiderRouter, false);
  mixin(crawler, EventEmitter.prototype, false);

  return crawler;
}

module.exports = createCrawler;
module.exports.request = SpiderRequest;
module.exports.response = SpiderResponse;
