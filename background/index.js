console.log("hi from bg");

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      {
        message: "clicked_browser_action",
      },
      {},
      (results = "apples") => {
        console.log("results from bg", results);
        // chrome.tabs.create({
        //   url: `http://google.com?q=${JSON.stringify(results)}`,
        // });
      }
    );
  });
});
