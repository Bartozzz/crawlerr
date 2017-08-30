import cheerio from "cheerio";

export default {
    cheerio : null,

    get( element ) {
        if ( ! this.cheerio ) {
            this.cheerio = cheerio.load( this.body );
        }

        return this.cheerio( element );
    }
};
