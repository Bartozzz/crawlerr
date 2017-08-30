# Crawlerr

[![Greenkeeper badge](https://badges.greenkeeper.io/Bartozzz/crawlerr.svg)](https://greenkeeper.io/)

> A simple and fully customizable web crawler for Node.js.

## Table of contents:

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Tests](#tests)

## Installation

```bash
$ npm install crawlerr
```

This module uses several `ECMAScript 2015` (ES6) features. You'll need the latest `Node.js` version in order to make it work correctly. You might need to run the script with the `--harmony` flag, for example:

```bash
$ node --harmony crawler.js
```

## Usage

You can find several examples in the `examples/` folder. There are the some of the most important ones:

### *Example 1: Requesting a title from url*

```javascript
const crawler = require( "../src/index" );
const spider  = crawler( "http://google.com/" );

spider.request( "/", ( req, res ) => {
    console.log( res.get( "title" ).html() )
}, error => {
    console.log( error );
} );
```

### *Example 2: Scanning a website for specific links*

```javascript
const crawler = require( "../src/index" );
const spider  = crawler( "http://blog.npmjs.org/" );

spider.when( "/post/[digit:id]/[all:slug]", ( req, res ) => {
    const id   = req.param( "id" );
    const slug = req.param( "slug" ).split( "?" )[ 0 ];

    console.log( `[I] Saving post with id: ${id} (${slug})` );
} );
```

## API

### crawler( base, options )

Creates a new `Crawler` for `base` website instance with custom `options`:

| Option      | Default | Description                                    |
|:------------|:--------|:-----------------------------------------------|
| queue       | Promise | Default queue object to use (see `src/queue/`) |
| concurrency | 10      | (only for `Promise` queue) How many request can be send at the same time |
| interval    | 250     | (only for `Promise` queue) How often should new request be send (in ms) |

#### **public** .request( url, callback )

Requests `url` and executes the specified `callback`.

#### **public** .when( url, callback )

Automatically starts the queue. Parses the entire website and executes `callback` when an url matches the `url` pattern.

---

### request object

Extends the default `Node.js` [incoming message](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

#### **public** get( header )

Returns the value of a HTTP `header`.

#### **public** is( ...types )

Checks whether the response is of a `type`. Based on [type-is](https://www.npmjs.com/package/type-is).

#### **public** param( name, default )

Return the value of a param (`params`, `body`, `query`) or the `default` value.

---

### response

Extends the default `Node.js` [incoming message](https://nodejs.org/api/http.html#http_class_http_incomingmessage).

#### **public** get( element )

Returns a DOM node. Based on [cheerio](https://www.npmjs.com/package/cheerio).

## Tests

```bash
$ npm test
```
