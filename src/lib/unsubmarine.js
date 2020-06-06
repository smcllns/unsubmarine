import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";
import { waitForGmailPageChangeOnce } from "./observers";

export default class Unsubmarine {
  constructor(limit = 5) {
    console.log("constructor Unsubmarine");
    this.killSwitch = false;
    this.delay = 1000;
    this.unsubLimit = limit;
    this.unsubCount;
    this.prevRun;
  }

  async *start() {
    console.log("started *start()");
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
    console.log("started run()");
    return new Promise(async (resolve, reject) => {
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        await waitForGmailPageChangeOnce();
        console.log("skip run for listView");
        if (this.killSwitch) resolve({ error: false, stop: true });
        return resolve({ error: false, skipIncrement: true });
      }

      let m = scrapeMessageMeta();
      console.log("m scraped:", m);
      if (m.url === this.prevRun?.m?.url) {
        // KP: scrape seems to have failed and m has new url but other fields are old.
        return resolve({
          error: true,
          msg: "same url",
          m,
        });
      }

      if (this.killSwitch) resolve({ error: false, stop: true });

      if (m.unsubLink) this.unsubCount++;

      if (m.nextBtn) {
        console.log("click Next");
        m.nextBtn.click();
        await waitForGmailPageChangeOnce();
        console.log("finished awaiting page change");
      }

      return resolve({ error: false, m });
    });
  }
}
