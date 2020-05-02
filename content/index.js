(async () => {
  const src = chrome.extension.getURL("content/unsubmarine.js");
  const unsubmarine = await import(src);

  chrome.runtime.onMessage.addListener(async (req, sender, sendRes) => {
    if (req.message === "clicked_browser_action") {
      const results = await unsubmarine.default();
      sendRes(results);
    }
  });
})();
