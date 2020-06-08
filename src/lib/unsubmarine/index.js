import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";
import { waitForGmailPageChangeOnce } from "./observers";

export default class Unsubmarine {
  constructor(limit = 3) {
    this.killSwitch = false;
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
      this.prevRun = result;

      if (result.skipIncrement) continue;

      if (result.stopped) return { ...result, log: "stop" };

      if (this.unsubCount >= this.unsubLimit) {
        console.log("hit unsubLimit", this.unsubCount, this.unsubLimit);
        return { ...result, log: "completed" };
      }

      yield { ...result, log: "yield" };
    }
  }

  async run() {
    console.log("started run()");
    return new Promise(async (resolve, reject) => {
      if (this.killSwitch) resolve({ stopped: true });
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        await waitForGmailPageChangeOnce();
        return resolve({ skipIncrement: true });
      }

      let m = scrapeMessageMeta();
      if (m.url === this.prevRun?.m?.url) {
        return resolve({ stopped: true });
      }

      if (m.nextBtn && !this.killSwitch) {
        m.nextBtn.click();
        await waitForGmailPageChangeOnce();
      }

      if (m.unsubLink) this.unsubCount++;
      resolve({ ...m });
    });
  }
}
