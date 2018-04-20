// @flow

import http from "http";
import typeis from "type-is";

const req = Object.create(http.IncomingMessage.prototype);

/**
 * Returns request header. The `Referrer` header field is special-cased, both
 * `Referrer` and `Referer` are interchangeable.
 *
 * @param   {string}    header
 * @return  {string}
 * @access  public
 */
req.get = function(header: string): string {
  if (!header || typeof header !== "string") {
    throw new TypeError(
      `req.get takes a string as argument, got ${typeof header}`
    );
  }

  const lower: string = header.toLowerCase();

  switch (lower) {
    case "referer":
    case "referrer":
      return this.headers.referrer || this.headers.referer;

    default:
      return this.headers[lower];
  }
};

/**
 * Check if the incoming request contains the "Content-Type" header field and it
 * contains the give mime `type`.
 *
 * @param   {string|Array}      types...
 * @return  {string|false}
 * @access  public
 */
req.is = function(...types: Array<string>): string | boolean {
  return typeis(this, types);
};

/**
 * Return the value of param `name` when present or `defaultValue`:
 * - checks route placeholders, ex: `user/[all:username]`;
 * - checks body params, ex: `id=12, {"id":12}`;
 * - checks query string params, ex: `?id=12`;
 *
 * @param   {string}    name
 * @param   {any}       defaultValue
 * @return  {string}
 * @access  public
 */
req.param = function(name: string, defaultValue: any): any {
  const params: Object = this.params || {};
  const query: Object = this.query || {};
  const body: Object = this.body || {};

  if (params[name] != null) return params[name];
  if (query[name] != null) return query[name];
  if (body[name] != null) return body[name];

  return defaultValue;
};

export default req;
