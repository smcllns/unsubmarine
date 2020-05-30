import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

export default class Unsubmarine {
  constructor(limit = 5) {
    this.delay = 1000; // TODO: detect DOM changes, not timer
    this.unsubLimit = limit;
    this.unsubCount = 0;
    this.prevRun;
  }

  async *start() {
    while (true) {
      const result = await this.run();
      if (result.error || this.unsubCount >= this.unsubLimit) {
        return result;
      }
      if (result.skipIncrement) continue;

      this.prevRun = result;
      yield result;
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
      if (m.url === this.prevRun?.m?.url) {
        // KP: scrape seems to have failed and m has new url but other fields are old
        resolve({
          error: true,
          msg: "same url",
          m,
        });
      }

      if (m.unsubLink) this.unsubCount++;
      if (m.nextBtn) m.nextBtn.click();

      setTimeout(() => {
        resolve({ error: false, m });
      }, this.delay);
    });
  }
}
