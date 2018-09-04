// @flow

import url from "url";
import retryRequest from "retry-request";
import getLink from "get-link";
import wildcard from "wildcard-named";
import setPrototypeOf from "setprototypeof";

const defaultOptions = {
  noResponseRetries: 0,
  retries: 1
};

export default {
  /**
   * Registered callbacks.
   *
   * @type    {object}
   * @access  protected
   */
  callbacks: {},

  /**
   * Add a handler for a specific uri. Accepts wildcards.
   *
   * @param   {string}    uri
   * @param   {Function}  callback
   * @return  {void}
   * @access  public
   */
  when(uri: string, callback: Function): void {
    this.callbacks[this.normalizeUri(uri)] = callback;
  },

  /**
   * Requests a single uri.
   *
   * @param   {string}    uri
   * @param   {Object}    opts
   * @return  {Promise}
   * @access  public
   */
  get(uri: string, opts: Object = defaultOptions): Promise<*> {
    uri = this.normalizeUri(uri);
    opts = { ...opts, request: this.request };

    return new Promise((resolve, reject) => {
      retryRequest(uri, opts, (error, response) => {
        if (error || response.statusCode !== 200) {
          return reject(error || uri);
        }

        const req: Object = {};
        const res: Object = response;

        // Set circular references:
        res.req = req;
        req.res = res;

        // Alter the prototypes:
        setPrototypeOf(req, this.req);
        setPrototypeOf(res, this.res);

        resolve({ req, res, uri });
      });
    });
  },

  /**
   * Resolves a relative URI with base path.
   *
   * @example
   *  normalizeUri("/")         // http://example.com/
   *  normalizeUri("/foo")      // http://example.com/foo
   *  normalizeUri("/bar.php")  // http://example.com/bar.php
   *
   * @param   {string}  uri
   * @return  {string}
   * @param   {Response}  res
   * @access  protected
   */
  normalizeUri(uri: string): string {
    if (!uri.startsWith(this.base)) {
      uri = url.resolve(this.base, uri);
    }

    return uri;
  },

  /**
   * Searches for new links from response and adds those to the queue.
   *
   * @param   {Request}   req
   * @param   {Response}  res
   * @access  protected
   */
  parseAnchors(req: Object, res: Object): void {
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
   * Checks whenever an uri matches registered callbacks and eventually executes
   * them. Populates the request with retreived parameters from URI.
   *
   * @param   {string}    uri
   * @param   {Request}   req
   * @param   {Response}  res
   * @return  {void}
   * @access  protected
   */
  callActions(uri: string, req: Object, res: Object): void {
    for (const index in this.callbacks) {
      const parameters: Object = wildcard(uri, index);
      const callback: Function = this.callbacks[index];

      if (uri === index || parameters) {
        // Merge request parameters with wildcard output:
        // NOTE: pheraps we should override params on each callback?
        req.params = { ...req.params, ...parameters };
        // mixin(req.params || {}, parameters || {});

        callback({ req, res, uri });
      }
    }
  }
};
