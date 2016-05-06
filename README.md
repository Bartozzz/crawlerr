# Crawlerr

> A simple and fully customizable web crawler for Node.js.

## Table of contents:

- [Installation](#installation)
- [Usage](#usage)
  - [Example 1: Requesting a title from url](#example-1-requesting-a-title-from-url)
  - [Example 2: Scanning a website structure](#example-2-scanning-a-website-structure)
  - [Example 3: Filtering and requesting](#example-3-filtering-and-requesting)
- [API](#api)
  - [new Crawler( options )](#new-crawler-options-)
    - [.get( url, callback )](#public-get-url-callback-)
    - [.scan( website, callback )](#public-scan-website-callback-)
  - [new Queue( options )](#new-queue-options-)
    - [.start()](#public-start)
    - [.stop()](#public-stop)
    - [.next()](#private-next)
    - [.on( event, callback )](#public-on-event-callback-)
  - [new Sitemap( website, options )](#new-sitemap-website-options-)
    - [.start()](#public-start-1)
    - [.isIgnored( url )](#private-isignored-url-)
    - [.isAllowed( url )](#private-isallowed-url-)
    - [.extract( url )](#private-extract-url-)
    - [.on( event, callback )](#public-on-event-callback--1)
  - [new LinkCollection( parameters )](#new-linkcollection-parameters-)
    - [.filter( pattern, callback )](#public-filter-pattern-callback-)
  - [new Request( uri, callback )](#new-request-uri-callback-)
    - [.setUrl( uri )](#private-seturl-uri-)
    - [.setCallback( callback )](#private-setcallback-callback-)
    - [.send()](#public-send)
  - [new Response( data, body )](#new-response-data-body-)
    - [.raw](#public-raw)
    - [.data](#public-data)
    - [.html](#public-html)
    - [.setData( value )](#private-setdata-value-)
    - [.setHtml( value )](#private-setbody-value-)
- [Tests](#tests)

## Installation

```bash
$ npm install crawlerr
```

This module uses several `ECMAScript 2015` (ES6) features. You'll need the latest `Node.js` version in order to make it work correctly. You might need to run the script with the `--es_staging` flag, for example:

```bash
$ node --es_staging crawler.js
```

## Usage

You can find several examples in the `examples/` folder. There are the some of the most important ones:

### *Example 1: Requesting a title from url*

```javascript
"use strict";

const Crawler = require( "crawler" );
const Spider  = new Crawler;

Spider.get( "http://google.com", ( response ) => {
    let $    = response.html;
    let data = response.data;

    console.log( $( "title" ).text() );
} );
```

### *Example 2: Scanning a website structure*

```javascript
"use strict";

const Crawler = require( "crawler" );
const Spider  = new Crawler( {
    concurrency : 10,
    interval    : 250
} );

Spider.scan( "http://blog.npmjs.org/", ( links ) => {
    console.log( links );
} );
```

### *Example 3: Filtering and requesting*

```javascript
"use strict";

const Crawler = require( "crawler" );
const Spider  = new Crawler;

Spider.ignore( "http://blog.npmjs.org/archieve" );
Spider.ignore( "http://blog.npmjs.org/tagged" );

Spider.scan( "http://blog.npmjs.org/", ( links ) => {
    links.filter( "http://blog.npmjs.org/page/[digit]", ( results ) => {
        for ( let page of results ) {
            Spider.get( page, parsePage );
        }
    } )
} );
```

## API

#### new Crawler( options )

Creates a new `Crawler` instance with custom options:

| Option      | Default | Description                                   |
|:------------|:--------|:----------------------------------------------|
| concurrency | 10      | How many request can be send at the same time |
| interval    | 250     | How often should new request be send (in ms)  |
| ignored     | {}      | Links to ignore when scanning                 |

#### **public** .ignore( url )

Add a link (string) or a bunch to link (array) to the ignored list.

#### **public** .get( url, callback )

Automatically starts the queue. Requests a `url` and executes the specified `callback`.

#### **public** .scan( website, callback )

Scans a `website` and executes a `callback` when the scan is completed.

---

#### new Queue( options )

Create a new `Queue` instance with optionally injected options.

| Option      | Default | Description                                   |
|:------------|:--------|:----------------------------------------------|
| concurrency | 10      | How many request can be send at the same time |
| interval    | 250     | How often should new request be send (in ms)  |

#### **public** .start()

Starts the queue.

#### **public** .stop()

Stops the queue.

#### **private** .next()

Goes to the next request and stops the loop if there is no requests left.

#### **public** .on( event, callback )

Sets a `callback` for an `event`. You can set callback for those events:
- start
- tick
- request[ url, output ]
- error[ message ]
- end

---

#### new Sitemap( website, options )

Create a new `Sitemap` instance for a website with optionally injected options.

| Option      | Default | Description                                    |
|:------------|:--------|:-----------------------------------------------|
| concurrency | 10      | How many request can be send at the same time  |
| interval    | 250     | How often should new request be send (in ms)   |
| auto        | true    | Whether it should start scanning automatically |

#### **private** .isIgnored( url )

Returns true if a url is on the `ignored` list.

#### **private** .isAllowed( url )

Returns true if a url is on the `allowed` list.

#### **public** .start()

Starts scanning the specified website.

#### **private** .extract( url )

Requests a `url`, parses its content for other, unknown links from the same domain.

#### **public** .on( event, callback )

Sets a `callback` for an `event`. You can set callback for those events:
- start
- end[ links ]

---

#### new LinkCollection( parameters )

Create a new `LinkCollection` instance with optionally injected parameters. See [`basic-collection`](https://github.com/Bartozzz/basic-collection) for more informations.

#### **public** .filter( pattern, callback )

Filters links then executes a callback. See [`basic-collection` filters](https://github.com/Bartozzz/basic-collection#example-3-filtering-values) for more informations.

---

#### new Request( uri, callback )

Create a new `Request` instance for a `url`.

#### **private** .setUrl( uri )

Parses a `uri`. If it is malformed, an error will be thrown.

#### **private** .setCallback( callback )

Check if the `callback` is a function.

#### **public** .send()

Sends the requests. Returns a Promise which resolves to a new `Response` object.

---

#### new Response( data, body )

Creates a new `Response` instance with `data` and `body`.

#### **public** .raw

Returns the raw response body.

#### **public** .html

Returns a `Cheerio` object for the response body.

#### **public** .data

Returns a the response data.

#### **private** .setData( value )

Sets the data for the current response.

#### **private** .setHtml( value )

Sets the html body for the current response.

## Tests

```bash
$ npm test
```
