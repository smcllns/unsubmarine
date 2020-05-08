console.log("hi from bg page!");

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: "clicked_browser_action",
    });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "open_new_tabs") {
    for (const url of request.urls) {
      console.log("got open tab instruction...", url);
      chrome.tabs.create({ url: url });
    }
  }
});
