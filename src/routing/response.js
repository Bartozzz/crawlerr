import cheerio from "cheerio";

export default {
    /**
     * Parsed response content.
     *
     * @type    {cheerio}
     */
    document : null,

    /**
     * Returns a cheerio object.
     *
     * @param   {string}    selector
     * @return  {cheerio}
     */
    get( selector ) {
        if ( !this.document ) {
            this.document = cheerio.load( this.body );
        }

        return this.document( selector );
    }
};
