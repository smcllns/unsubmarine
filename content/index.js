import unsubmarine from "./unsubmarine.js";

export default () => {
  chrome.runtime.onMessage.addListener((req) => {
    if (req.message === "clicked_browser_action") {
      unsubmarine();
    }
  });
};
