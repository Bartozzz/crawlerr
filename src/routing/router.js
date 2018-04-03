// @flow

import url from "url";
import request from "retry-request";
import mixin from "merge-descriptors";
import getLink from "get-link";
import wildcard from "wildcard-named";
import setPrototypeOf from "setprototypeof";

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
   * @return  {Promise}
   * @access  public
   */
  when(uri: string): Promise<*> {
    return new Promise(resolve => {
      this.callbacks[url.resolve(this.base, uri)] = resolve;
    });
  },

  /**
   * Requests a single uri.
   *
   * @param   {string}    uri
   * @return  {Promise}
   * @access  public
   */
  get(uri: string): Promise<*> {
    if (!uri.startsWith(this.base)) {
      uri = url.resolve(this.base, uri);
    }

    return new Promise((resolve, reject) => {
      request(uri, (error, response) => {
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
        mixin(req.params || {}, parameters || {});

        callback({ req, res, uri });
      }
    }
  }
};
