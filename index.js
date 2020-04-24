function unsubmarine(nProvided) {
  let i,
    n,
    delay = 1000,
    results;

  function __reset() {
    i = 0;
    n = 0;
    results = { scraped: [], actioned: [] };
  }

  function __scrape() {
    let possibleUnsubLinks = Array.from(
      document.querySelectorAll('[role="listitem"] a')
    ).filter((a) => /unsubscribe/i.test(a?.textContent));
    let possibleUnsubBtn = document.querySelector("[idlink]");
    let possibleNextBtns = true
      ? document.querySelectorAll('[data-tooltip="Older"]')
      : document.querySelectorAll('[data-tooltip="Newer"]');

    let sender = document.querySelectorAll("span .go")[0]?.textContent;
    let subject = document.querySelectorAll("[data-thread-perm-id]")[0]
      ?.textContent;
    let when = document.querySelectorAll('[alt*=":"][title*=":"]')[0]
      ?.textContent;
    let url = window.location.href;
    let unsubBtn =
      possibleUnsubBtn?.textContent?.toLowerCase() === "unsubscribe"
        ? possibleUnsubBtn
        : false;
    let unsubLink =
      possibleUnsubLinks.length > 0 ? possibleUnsubLinks.pop() : false;
    let nextBtn = Array.from(possibleNextBtns)
      .filter((n) => n.offsetParent)
      .pop();

    return {
      sender,
      subject,
      when,
      unsubLink,
      unsubBtn,
      nextBtn,
      url,
    };
  }

  function __run(prevM) {
    let m = __scrape();
    if (i >= n) return __printResults(results, { i, n, m, msg: "i>=n" });
    if (m?.url === prevM?.url)
      return __printResults(results, { i, n, m, msg: "same url" });

    results.scraped.push(m);

    if (m.unsubLink) {
      m.unsubLink.click();
      results.actioned.push(m);
    }

    if (m.nextBtn) {
      m.nextBtn.click();
      i++;
    }

    console.log("tick", { i, n, m, r: results.actioned });
    setTimeout(() => {
      __run(m);
    }, delay);
  }

  function __printResults(results, debug) {
    console.log(`Debug:`, debug);
    console.group(`${results.actioned.length} Results Actioned:`);
    results.actioned?.map((r) =>
      console.log(
        `${r.when} - ${r.sender?.replace(/[\<\>]/g, "")} - ${r.subject}`
      )
    );
    console.log();
    console.groupEnd();
  }

  (function __start(nProvided) {
    __reset();
    n =
      nProvided ||
      prompt(
        "How many emails to loop through? (This also " +
        "roughly equates to the number of browser " +
        "tabs this script will open)", 25
      );
    n = parseInt(n, 10);
    if (!Number.isInteger(n))
      return alert("Number must be an integer greater than zero");
    __run();
  })(nProvided);
}
