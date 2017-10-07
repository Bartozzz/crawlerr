import {JSDOM} from "jsdom";

export default {
    get jsdom() {
        return new JSDOM(this.body);
    },

    get window() {
        return this.jsdom.window;
    },

    get document() {
        return this.window.document;
    },
};
