"use strict";

const url = require("url");
const Bloom = require("bloomfilter").BloomFilter;
const request = require("retry-request");

module.exports = {
    links: new Bloom(64 * 256, 16),
    queue: undefined,

    init() {
        throw "Not implemented";
    },

    parse(req, res) {
        throw "Not implemented";
    },

    handle(uri) {
        throw "Not implemented";
    },

    request(uri, done, reject) {
        if (!uri.startsWith(this.base)) uri = url.resolve(this.base, uri);

        request(uri, (error, response, body) => {
            if (error || response.statusCode != 200) {
                reject(error || uri);
            }

            const req = {};
            const res = response;

            // Set circular references:
            res.req = req;
            req.res = res;

            // Alter the prototypes:
            req.__proto__ = this.req;
            res.__proto__ = this.res;

            done(req, res);
        });
    }
};