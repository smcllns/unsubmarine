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

const waitForListViewReady = (timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const check = () => {
      const rows = Array.from(
        document.querySelectorAll("[role=main] [role=row]")
      ).filter((node) => node.offsetParent);

      if (rows.length > 0) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error("Timeout waiting for list view"));
        return;
      }

      requestAnimationFrame(check);
    };

    check();
  });
};

export { waitForGmailPageChangeOnce, waitForListViewReady };
