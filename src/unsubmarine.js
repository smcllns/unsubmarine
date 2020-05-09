import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

import handleResults from "./handleResults.js";

export default class Unsubmarine {
  constructor(resolve) {
    this.i = 0;
    this.n = 0;
    this.delay = 1000;
    this.results = {};
    this.resolve = resolve;
  }

  reset() {
    this.i = 0;
    this.n = 0;
    this.results = {
      scraped: [],
      actionable: [],
    };
  }

  start() {
    this.reset();
    const n = prompt(
      "How many emails to loop through? (This also " +
        "roughly equates to the number of browser " +
        "tabs this script will open)",
      25,
    );
    const nInt = parseInt(n, 10);
    if (!Number.isInteger(nInt)) {
      alert("Number must be an integer greater than zero..");
      this.n = 0;
    } else {
      this.n = nInt;
    }
    this.run();
  }

  async run(prevM) {
    if (this.i >= this.n) {
      return handleResults(
        this.results,
        {
          msg: "i >= n",
        },
        this.resolve,
      );
    }

    if (isListView()) {
      let l = scrapeListMeta();
      l.firstItem.click();
      setTimeout(() => {
        this.run();
      }, this.delay * 5);
    }

    let m = scrapeMessageMeta();

    if (m?.url === prevM?.url)
      return handleResults(
        this.results,
        {
          msg: "same url",
        },
        this.resolve,
      );

    this.results.scraped.push(m);

    if (m.unsubLink) {
      this.results.actionable.push(m);
    }

    if (m.nextBtn) {
      m.nextBtn.click();
      this.i = this.i + 1;
    }

    const analyticsObj = {
      i: this.i,
      n: this.n,
      a: this.results.actionable.length,
      m: m,
    };
    console.log("tick", analyticsObj);

    setTimeout(() => {
      this.run(m);
    }, this.delay);
  }
}

// export default function exec() {
//   console.log("running unsubmarine");
//   return new Promise((resolve, reject) => {
//     const unsub = new Unsubmarine(resolve);
//     const results = unsub.start();
//     // resolve(results);
//   });
// }
