import { JSDOM } from "jsdom";

export default {
  get jsdom(): JSDOM {
    return new JSDOM(this.body);
  },

  get window(): JSDOM {
    return this.jsdom.window;
  },

  get document(): JSDOM {
    return this.window.document;
  }
};
