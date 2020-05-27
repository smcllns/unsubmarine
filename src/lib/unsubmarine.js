import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

export default class Unsubmarine {
  constructor() {
    this.delay = 1000;
    this.prevRun;
  }

  async *start(nGiven) {
    let i = 0;
    nGiven =
      nGiven ||
      prompt(
        "How many emails to loop through? (This also " +
          "roughly equates to the number of browser " +
          "tabs this script will open)",
        10,
      );
    const n = parseInt(nGiven, 10);
    if (!Number.isInteger(n) || n < 1) {
      alert("Number must be an integer greater than zero");
      return { error: true, msg: "n < 1", i, n: -1 };
      // returning from generator will return done: true
    }

    while (true) {
      const result = await this.run();
      this.prevRun = result;
      if (i >= n - 1 || result.error) {
        return { ...result, n, i };
        // returning from generator will return done: true
      }
      if (!result.skipIncrement) {
        yield { ...result, n, i };
        // yielding from generator will return done: true
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
        }, this.delay * 6);
      }

      let m = scrapeMessageMeta();
      console.log(m.url, this.prevRun?.m?.url, this.prevRun?.m);
      if (m.url === this.prevRun?.m?.url) {
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
