const waitForGmailPageChangeOnce = () => {
  // Gmail switches [role=main] to different elements when navigating to new "page"
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.target.getAttribute("role") === "main"
        ) {
          console.log("gmail page change detected");
          observer.disconnect();
          resolve(mutation.target);
        }
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["role"],
    });
  });
};

export { waitForGmailPageChangeOnce };
