// @flow

import { BloomFilter } from "bloomfilter";
import Queue from "queue-promise";
import getLink from "get-link";

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
   * Creates a new queue and initialises it.
   *
   * @return  {void}
   * @access  public
   */
  start(): void {
    this.queue = new Queue({
      concurrency: this.opts.concurrency,
      interval: this.opts.interval
    });

    this.handle(this.base)()
      .then(() => {
        this.queue.on("start", () => this.emit("start"));
        this.queue.on("stop", () => this.emit("stop"));
        this.queue.on("tick", () => this.emit("tick"));
        this.queue.on("resolve", e => this.emit("request", e));
        this.queue.on("reject", e => this.emit("error", e));

        this.queue.start();
      })
      .catch(error => {
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
    if (this.queue) {
      this.queue.stop();
    }
  },

  /**
   * Searches for new links from response and adds those to the queue.
   *
   * @param   {Request}   req
   * @param   {Response}  res
   * @access  protected
   */
  parse(req: Object, res: Object): void {
    const document: Object = res.document;
    const as: Array<HTMLAnchorElement> = document.getElementsByTagName("a");

    for (const a of as) {
      const href: any = a.getAttribute("href");
      const link: string = getLink(this.base, href);

      if (link && !this.cache.test(link)) {
        this.cache.add(link);
        this.queue.add(this.handle(link));
      }
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
              this.check(url, req, res);
              this.parse(req, res);
            } catch (error) {
              reject(error);
            }

            resolve(url);
          })
          .catch(reject);
      });
  }
};
