import { isListView, scrapeListMeta, scrapeMessageMeta } from "./scraper.js";
import { waitForGmailPageChangeOnce } from "./observers";

export default class Unsubmarine {
  constructor() {
    this.killSwitch = false;
    this.prev;
  }

  async *run() {
    this.killSwitch = false;
    this.prev = undefined;

    while (true) {
      if (this.killSwitch) return;
      const result = await this.exec();
      if (result.skip) continue;
      result.error ? yield { error: true } : yield { ...result };
    }
  }

  async exec() {
    return new Promise(async (resolve, reject) => {
      if (isListView()) {
        let l = scrapeListMeta();
        l.firstItem.click();
        await waitForGmailPageChangeOnce();
        return resolve({ skip: true });
      }

      let current = scrapeMessageMeta();
      // console.log("m", current, this.prev);

      if (current.url === this.prev?.url) {
        console.log("error");
        return resolve({ error: true });
      }

      if (current.nextBtn && !this.killSwitch) {
        current.nextBtn.click();
        await waitForGmailPageChangeOnce();
      }

      this.prev = current;
      resolve(current);
    });
  }
}
