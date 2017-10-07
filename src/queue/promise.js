import {BloomFilter} from "bloomfilter";
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
    start() {
        this.queue = new Queue({
            concurrency: this.opts.concurrency,
            interval: this.opts.interval,
        });

        this.handle(this.base)()
            .then(() => {
                this.queue.on("start", () => this.emit("start"));
                this.queue.on("stop", () => this.emit("stop"));
                this.queue.on("tick", () => this.emit("tick"));
                this.queue.on("resolve", (e) => this.emit("request", e));
                this.queue.on("reject", (e) => this.emit("error", e));

                this.queue.start();
            })
            .catch((error) => {
                this.emit("error", error);
            });
    },

    /**
     * Searches for new links from response and adds those to the queue.
     *
     * @param   {Request}   req
     * @param   {Response}  res
     * @access  protected
     */
    parse(req, res) {
        const document = res.document;
        const anchors = document.getElementsByTagName("a");

        for (const anchor of anchors) {
            const href = anchor.getAttribute("href");
            const link = getLink(this.base, href);

            if (link && !this.cache.test(link)) {
                const extracted = this.handle(link);

                if (extracted) {
                    this.cache.add(link);
                    this.queue.add(extracted);
                }
            }
        }
    },

    /**
     * Handles a given url:
     * - executes a callback if it matches any registered wildcard;
     * - parses its content for new links;
     *
     * @param   {string}    url
     * @return  {Promise}
     * @access  protected
     */
    handle(url) {
        return () => new Promise((resolve, reject) => {
            this.get(url).then(({req, res}) => {
                try {
                    this.check(url, req, res);
                    this.parse(req, res);
                } catch (error) {
                    reject(error);
                }

                resolve(url);
            }).catch(reject);
        });
    },
};
