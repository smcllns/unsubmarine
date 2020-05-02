import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

import handleResults from "./handleResults.js";

class Unsubmarine {
  constructor() {
    this.i = 0;
    this.n = 0;
    this.delay = 1000;
    this.results = {};
  }

  reset() {
    this.i = 0;
    this.n = 0;
    this.results = {
      scraped: [],
      actioned: [],
      toActionMap: new WeakMap(),
      toActionArr: [],
    };
  }

  start() {
    this.reset();
    const n = prompt(
      "How many emails to loop through? (This also " +
        "roughly equates to the number of browser " +
        "tabs this script will open)",
      25
    );
    const nInt = parseInt(n, 10);
    if (!Number.isInteger(nInt)) {
      alert("Number must be an integer greater than zero");
      this.n = 0;
    } else {
      this.n = nInt;
    }
    this.run();
  }

  run(prevM) {
    if (this.i >= this.n) {
      return handleResults(this.results, {
        msg: "i >= n",
      });
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
      return handleResults(this.results, {
        msg: "same url",
      });

    this.results.scraped.push(m);

    if (m.unsubLink) {
      if (!this.results.toActionMap.has(m.unsubLink))
        this.results.toActionArr.push(m);
      this.results.toActionMap.set(m, m.unsubLink);
    }

    if (m.nextBtn) {
      m.nextBtn.click();
      this.i = this.i + 1;
    }

    const analyticsObj = {
      i: this.i,
      n: this.n,
      a: this.results.toActionArr.length,
      m: m,
    };
    console.log("tick", analyticsObj);

    setTimeout(() => {
      this.run(m);
    }, this.delay);
  }
}

export default function exec() {
  console.log("running unsubmarine");
  return new Promise((resolve, reject) => {
    const unsub = new Unsubmarine();
    const results = unsub.start();
    resolve(results);
  });
}
