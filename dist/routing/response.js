"use strict";

const cheerio = require("cheerio");

module.exports = {
    cheerio: null,

    get(element) {
        if (!this.cheerio) {
            this.cheerio = cheerio.load(this.body);
        }

        return this.cheerio(element);
    }
};