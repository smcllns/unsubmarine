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
    this.unsubLimit = 5;
    this.unsubCount;
  }

  async *start() {
    let i = 0;
    this.unsubCount = 0;

    while (true) {
      const result = await this.run();
      if (result.error || this.unsubCount >= this.unsubLimit) {
        return { ...result, i };
      }
      if (!result.skipIncrement) {
        yield { ...result, i };
        this.prevRun = result;
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

      if (m.unsubLink) this.unsubCount++;
      if (m.nextBtn) m.nextBtn.click();

      setTimeout(() => {
        resolve({ error: false, m });
      }, this.delay);
    });
  }
}
