"use strict";

const url = require("url");
const mixin = require("merge-descriptors");
const wildcard = require("wildcard-named");

module.exports = {
    crawling: false,
    callbacks: {},

    when(uri, callback) {
        if (!this.crawling) {
            this.crawling = true;

            setTimeout(this.init.bind(this), 0);
        }

        this.add(uri, callback);
    },

    add(uri, callback) {
        const href = url.resolve(this.base, uri);
        const resp = callback;

        this.callbacks[href] = resp;
    },

    check(uri, req, res) {
        for (let index in this.callbacks) {
            let requested = wildcard(uri, index);
            let callback = this.callbacks[index];

            if (uri === index || requested) {
                mixin(req.params, requested || {});
                callback(req, res, uri);
            }
        }
    }
};