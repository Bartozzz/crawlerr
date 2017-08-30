<div align="center">
  <h1>crawlerr</h1>

[![Greenkeeper badge](https://badges.greenkeeper.io/Bartozzz/crawlerr.svg)](https://greenkeeper.io/)
[![Build Status](https://img.shields.io/travis/Bartozzz/crawlerr.svg)](https://travis-ci.org/Bartozzz/crawlerr/)
[![npm version](https://img.shields.io/npm/v/crawlerr.svg)](https://www.npmjs.com/package/crawlerr)
[![npm downloads](https://img.shields.io/npm/dt/crawlerr.svg)](https://www.npmjs.com/package/crawlerr)
  <br>

**crawlerr** is simple and fully customizable web crawler for Node.js, based on Promises. It provides core features such as *server-side DOM* (JSDOM), *configurable pool size* and retries, *rate limit*. This tool also allows you to crawl specific urls only based on *wildcards*.
</div>

<h2 align="center">Installation</h2>

```bash
$ npm install crawlerr
```

<h2 align="center">Usage</h2>

`crawlerr( base [, options] )`

You can find several examples in the `examples/` folder. There are the some of the most important ones:

### *Example 1: Requesting a title from url*

```javascript
const spider = crawlerr( "http://google.com/" );

spider.get( "/" )
    .then( ( { req, res, uri } ) => {
        console.log( res.document.title );
    } )
    .catch( error => {
        console.log( error );
    } );
```

### *Example 2: Scanning a website for specific links*

```javascript
const spider = crawlerr( "http://blog.npmjs.org/" );

spider.when( "/post/[digit:id]/[all:slug]" ).then( ( { req, res, uri } ) => {
    const id   = req.param( "id" );
    const slug = req.param( "slug" ).split( "?" )[ 0 ];

    console.log( `Found post with id: ${id} (${slug})` );
} );

spider.start();
```

### *Example 3: Get html content by id*

```javascript
const spider = crawlerr( "http://example.com/" );

spider.get( "/" ).then( ( { req, res, uri } ) => {
    const document = res.document;
    const someElem = document.getElementById( "someElement" );

    console.log( someElem.innerHTML );
} );
```

<h2 align="center">API</h2>

### `crawlerr( base [, options] )`

Creates a new `Crawlerr` instance for `base` website with custom `options`:

| Option      | Default | Description                                    |
|:------------|:--------|:-----------------------------------------------|
| concurrency | 10      | How many request can be send at the same time  |
| interval    | 250     | How often should new request be send (in ms)   |

#### **public** `.get( url )`

Requests `url`. Returns a `Promise` with `{ req, res, uri }` as response, where `req` is the [Request object](#request), `res` is the [Response object](#response) and `uri` is the absolute `url` (resolved from `base`).

#### **public** `.when( url )`

Searches on the entire website (not just a single page) urls matching the `url` pattern. `url` can include named [wildcards](https://github.com/Bartozzz/wildcard-named) which can be then retrieved in the response with `res.param`.

#### **public** `start()`

Starts the crawler.

---

### Request

Extends the default `Node.js` [incoming message](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

#### **public** `get( header )`

Returns the value of a HTTP `header`. The `Referrer` header field is special-cased, both `Referrer` and `Referer` are interchangeable.

#### **public** `is( ...types )`

Check if the incoming request contains the "Content-Type" header field, and it contains the give mime `type`. Based on [type-is](https://www.npmjs.com/package/type-is).

#### **public** `param( name [, default] )`

Return the value of param `name` when present or `defaultValue`:
- checks route placeholders, ex: `user/[all:username]`;
- checks body params, ex: `id=12, {"id":12}`;
- checks query string params, ex: `?id=12`;

---

### Response

#### **public** `jsdom`

Returns the [JSDOM](https://www.npmjs.com/package/jsdom) object.

#### **public** `window`

Returns the DOM window for response content. Based on [JSDOM](https://www.npmjs.com/package/jsdom).

#### **public** `document`

Returns the DOM document for response content. Based on [JSDOM](https://www.npmjs.com/package/jsdom).
