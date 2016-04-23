# Crawlerr

> A simple and fully customizable web crawler for Node.js.

## Table of contents:

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Tests](#tests)

## Installation

```bash
$ npm install crawler
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
    let $    = response.body;
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

#### **private** .setData( value )

Sets the data for the current response.

#### **private** .setBody( value )

Sets the body for the current response.

## Tests

```bash
$ npm test
```
