(async () => {
  const src = chrome.extension.getURL("content/index.js");
  const main = await import(src);
  main.default();
})();
