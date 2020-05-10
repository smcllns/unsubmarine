import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

export default class Unsubmarine {
  constructor() {
    this.delay = 1000;
    this.lastRun = {};
  }

  async *start() {
    let i = 0;
    const nGiven = prompt(
      "How many emails to loop through? (This also " +
        "roughly equates to the number of browser " +
        "tabs this script will open)",
      25,
    );
    const n = parseInt(nGiven, 10);
    if (!Number.isInteger(n) || n < 1) {
      alert("Number must be an integer greater than zero");
      return { error: true, msg: "n < 1", i, n: -1 };
    }

    yield { i, n, error: false };

    while (true) {
      const result = await this.run();
      this.lastRun = result;
      if (i >= n - 1 || result.error) {
        return { ...result, n, i };
      }
      if (!result.skipIncrement) {
        yield { ...result, n, i };
        i++;
      }
    }
  }

  async run() {
    return new Promise((resolve, reject) => {
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        setTimeout(() => {
          resolve({ error: false, skipIncrement: true });
        }, this.delay * 3);
      }

      let m = scrapeMessageMeta();
      console.log(m.url, this.lastRun?.m?.url, this.lastRun?.m);
      if (m.url === this.lastRun?.m?.url) {
        resolve({
          error: true,
          msg: "same url",
          m,
        });
      }

      if (m.nextBtn) m.nextBtn.click();

      setTimeout(() => {
        resolve({ error: false, m });
      }, this.delay);
    });
  }
}
