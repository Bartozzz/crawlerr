// @flow

import url from "url";
import request from "retry-request";
import mixin from "merge-descriptors";
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
    let link = uri;

    if (!uri.startsWith(this.base)) {
      link = url.resolve(this.base, uri);
    }

    return new Promise((resolve, reject) => {
      request(link, (error, response) => {
        if (error || response.statusCode != 200) {
          reject(error || link);
        }

        const req: Object = {};
        const res: Object = response;

        // Set circular references:
        res.req = req;
        req.res = res;

        // Alter the prototypes:
        setPrototypeOf(req, this.req);
        setPrototypeOf(res, this.res);

        resolve({ req, res, link });
      });
    });
  },

  /**
   * Checks whenever an uri matches the registered callbacks and eventually
   * executes the callback.
   *
   * @param   {string}    uri
   * @param   {Request}   req
   * @param   {Response}  res
   * @return  {void}
   * @access  protected
   */
  check(uri: string, req: Object, res: Object): void {
    for (const index in this.callbacks) {
      if (!this.callbacks.hasOwnProperty(index)) {
        continue;
      }

      const requested: Object = wildcard(uri, index);
      const callback: Function = this.callbacks[index];

      if (uri === index || requested) {
        // Merge request parameters with wildcard output:
        mixin(req.params, requested || {});

        callback({ req, res, uri });
      }
    }
  }
};
