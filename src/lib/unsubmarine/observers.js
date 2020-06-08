const waitForGmailPageChangeOnce = () => {
  // Gmail uses [role=main] for the RHS "page"
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.target.getAttribute("role") === "main"
        ) {
          console.log("role=main change");
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
