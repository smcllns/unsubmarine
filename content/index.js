(async () => {
  const src = chrome.extension.getURL("content/unsubmarine.js");
  const unsubmarine = await import(src);

  chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    if (req.message === "clicked_browser_action") {
      console.log("starting submarine");
      const results = await unsubmarine.default();
      console.log("top level results", results);
      chrome.runtime.sendMessage({ message: "open_new_tabs", urls: results });
      return true;
    }
  });
})();
