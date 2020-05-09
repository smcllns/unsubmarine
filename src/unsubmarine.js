import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

export default class Unsubmarine {
  constructor() {
    this.i = 0;
    this.n = 0;
    this.delay = 1000;
    this.results = {};
    this.resolve = undefined;
  }

  reset() {
    this.i = 0;
    this.n = 0;
    this.results = {
      scraped: [],
      actionable: [],
    };
  }

  createResultObj(debugMsg) {
    return {
      results: this.results,
      debug: {
        msg: debugMsg,
        i: this.i,
        n: this.n,
      },
    };
  }

  start() {
    return new Promise((resolve, reject) => {
      this.reset();
      const n = prompt(
        "How many emails to loop through? (This also " +
          "roughly equates to the number of browser " +
          "tabs this script will open)",
        25,
      );
      const nInt = parseInt(n, 10);
      if (!Number.isInteger(nInt) || nInt < 1) {
        alert("Number must be an integer greater than zero");
        const results = this.createResultObj("n < 1");
        return resolve(results);
      }
      this.n = nInt;
      this.resolve = resolve;
      this.run();
    });
  }

  async run(prevM) {
    if (isListView()) {
      let l = scrapeListMeta();
      l.firstItem.click();
      return setTimeout(() => {
        this.run();
      }, this.delay * 5);
    }

    let m = scrapeMessageMeta();

    if (m?.url === prevM?.url) {
      const results = this.createResultObj("same url");
      return this.resolve(results);
    }

    this.results.scraped.push(m);

    if (m.unsubLink) {
      this.results.actionable.push(m);
    }

    console.log("tick", {
      i: this.i,
      n: this.n,
      a: this.results.actionable.length,
      m: m,
    });

    if (this.i >= this.n - 1) {
      const results = this.createResultObj("n === i");
      return this.resolve(results);
    } else {
      this.i = this.i + 1;
      m.nextBtn.click();
      setTimeout(() => {
        this.run(m);
      }, this.delay);
    }
  }
}
