import cheerio from "cheerio";

export default {
    /**
     * Returns a cheerio object.
     *
     * @param   {string}    selector
     * @return  {cheerio}
     * @access  public
     */
    get( selector ) {
        return this.document( selector );
    },

    /**
     * Loads contents and returns a valid cheerio object.
     *
     * @return  {cheerio}
     * @access  public
     */
    get document() {
        return cheerio.load( this.body );
    }
};
