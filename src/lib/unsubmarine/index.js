import {
  isListView,
  isMessageView,
  scrapeListMeta,
  scrapeMessageMeta,
} from "./scraper.js";
import { waitForGmailPageChangeOnce } from "./observers";

export default class Unsubmarine {
  constructor() {
    this.killSwitch = false;
    this.prevRun;
  }

  async *start() {
    this.prevRun = undefined;

    while (true) {
      if (this.killSwitch) return;

      let result;
      try {
        result = await this.run();
      } catch (err) {
        console.log("err");
        return;
      }

      if (result.skipIncrement) continue;
      if (result.stopped) return;
      yield result;

      this.prevRun = result;
    }
  }

  async run() {
    console.log("started run()");
    return new Promise(async (resolve, reject) => {
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        await waitForGmailPageChangeOnce();
        return resolve({ skipIncrement: true });
      }

      if (isMessageView()) {
        let m = scrapeMessageMeta();

        if (m.url === this.prevRun?.url) {
          return resolve({ stopped: true });
        }

        if (m.nextBtn) {
          m.nextBtn.click();
          await waitForGmailPageChangeOnce();
        }

        return resolve(m);
      }
      reject();
    });
  }
}
