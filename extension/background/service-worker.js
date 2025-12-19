// Unsubmarine Service Worker (Manifest V3)

// Enable action only for mail.google.com using declarativeContent
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: "mail.google.com" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

// Pass message to content scripts on extension click
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, {
    message: "clicked_browser_extension_icon",
  });
});

// Receive messages from content scripts to open new urls
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "open_new_tabs") {
    for (const url of request.urls) {
      chrome.tabs.create({ url });
    }
  }
});
