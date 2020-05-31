import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";

export default class Unsubmarine {
  constructor(limit = 5) {
    this.killSwitch = false;
    this.delay = 1000; // TODO: detect DOM changes, not timer
    this.unsubLimit = limit;
    this.unsubCount;
    this.prevRun;
  }

  async *start() {
    this.prevRun = undefined;
    this.unsubCount = 0;
    while (true) {
      if (this.killSwitch) return { log: "stop" };

      const result = await this.run();
      if (result.error) return { ...result, log: "error" };
      if (result.stop) return { ...result, log: "stop" };
      if (result.skipIncrement) continue;

      if (this.unsubCount >= this.unsubLimit) {
        return { ...result, log: "completed" };
      } else {
        this.prevRun = result;
        yield { ...result, log: "yield" };
      }
    }
  }

  async run() {
    return new Promise((resolve, reject) => {
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        return setTimeout(() => {
          if (this.killSwitch) resolve({ error: false, stop: true });
          resolve({ error: false, skipIncrement: true });
        }, this.delay * 3);
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

      return setTimeout(() => {
        if (this.killSwitch) resolve({ error: false, stop: true });
        resolve({ error: false, m });
      }, this.delay);
    });
  }
}
