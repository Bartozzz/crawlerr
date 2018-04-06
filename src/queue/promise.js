// @flow

import { BloomFilter } from "bloomfilter";
import Queue from "queue-promise";

export default {
  /**
   * Parsed urls are cached using Bloom filter.
   *
   * @see     https://en.wikipedia.org/wiki/Bloom_filter
   * @see     https://hur.st/bloomfilter?n=10000&p=1.0E-5
   * @type    {BloomFilter}
   * @access  protected
   */
  cache: new BloomFilter(32 * 64 * 128, 17),

  /**
   * Queue object.
   *
   * @type    {Queue}
   * @access  protected
   */
  queue: null,

  /**
   * Creates a new queue and initialises it. Re-emits queue events in crawler.
   *
   * @return  {void}
   * @access  public
   */
  start(): void {
    this.queue = new Queue({
      concurrent: this.opts.concurrent,
      interval: this.opts.interval,
      start: false
    });

    this.queue.on("start", () => this.emit("start"));
    this.queue.on("stop", () => this.emit("stop"));
    this.queue.on("resolve", e => this.emit("request", e));
    this.queue.on("reject", e => this.emit("error", e));
    this.queue.start();

    this.handle(this.base)().catch(error => {
      this.emit("error", error);
    });
  },

  /**
   * Stops the queue if it is running.
   *
   * @return  {void}
   * @access  public
   */
  stop(): void {
    if (this.queue && this.queue.started) {
      this.queue.stop();
    }
  },

  /**
   * Handles a given url:
   * - executes a callback if it matches any registered wildcard;
   * - parses its content for new links;
   *
   * @param   {string}    url
   * @return  {function}
   * @access  protected
   */
  handle(url: string): () => Promise<*> {
    return () =>
      new Promise((resolve, reject) => {
        this.get(url)
          .then(({ req, res }) => {
            try {
              this.callActions(url, req, res);
              this.parseAnchors(req, res);
            } catch (error) {
              reject(error);
            }

            resolve(url);
          })
          .catch(reject);
      });
  }
};
