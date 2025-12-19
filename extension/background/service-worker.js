// Unsubmarine Service Worker (Manifest V3)

// Enable action only for mail.google.com
chrome.runtime.onInstalled.addListener(() => {
  // Disable the action by default
  chrome.action.disable();
});

// Enable/disable action based on the current tab URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("mail.google.com")) {
    chrome.action.enable(tabId);
  } else {
    chrome.action.disable(tabId);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.url.includes("mail.google.com")) {
      chrome.action.enable(activeInfo.tabId);
    } else {
      chrome.action.disable(activeInfo.tabId);
    }
  } catch (e) {
    // Tab may not exist or be accessible
  }
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
