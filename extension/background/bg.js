// Enable PageAction only for mail.google.com
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "mail.google.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// Pass message to contentscripts on extension click
chrome.pageAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, {
    message: "clicked_browser_extension_icon",
  });
});

// Receive messages from contentscripts to open new urls
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === "open_new_tabs") {
    for (const url of request.urls) {
      chrome.tabs.create({ url });
    }
  }
});
