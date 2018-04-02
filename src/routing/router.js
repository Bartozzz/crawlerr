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
