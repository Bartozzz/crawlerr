// @flow

import http from "http";
import typeis from "type-is";

export default {
  // Request prototype:
  __proto__: http.IncomingMessage.prototype,

  /**
   * Returns request header. The `Referrer` header field is special-cased,
   * both `Referrer` and `Referer` are interchangeable.
   *
   * @param   {string}    header
   * @return  {string}
   * @access  public
   */
  get(header: string): string {
    if (!header) {
      throw new TypeError("Name argument is required to req.get");
    }

    if (typeof header !== "string") {
      throw new TypeError("Name must be a string to req.get");
    }

    const lower: string = header.toLowerCase();

    switch (lower) {
      case "referer":
      case "referrer":
        return this.headers.referrer || this.headers.referer;

      default:
        return this.headers[lower];
    }
  },

  /**
   * Check if the incoming request contains the "Content-Type" header field,
   * and it contains the give mime `type`.
   *
   * @param   {string|array}      types...
   * @return  {string|false}
   * @access  public
   */
  is(...types: Array<string>): string | boolean {
    return typeis(this, types);
  },

  /**
   * Return the value of param `name` when present or `defaultValue`:
   * - checks route placeholders, ex: `user/[all:username]`;
   * - checks body params, ex: `id=12, {"id":12}`;
   * - checks query string params, ex: `?id=12`;
   *
   * @param   {string}    name
   * @param   {mixed}     defaultValue
   * @return  {string}
   * @access  public
   */
  param(name: string, defaultValue: any): any {
    const params: Object = this.params || {};
    const query: Object = this.query || {};
    const body: Object = this.body || {};

    if (params[name] != null) return params[name];
    if (query[name] != null) return query[name];
    if (body[name] != null) return body[name];

    return defaultValue;
  }
};
