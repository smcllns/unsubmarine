export default function unsubmarine(nProvided) {
  // All let bc pasting const into console can only be done once
  let i,
    n,
    delay = 1000,
    results;

  function reset() {
    i = 0;
    n = 0;
    results = {
      scraped: [],
      actioned: [],
      toActionMap: new WeakMap(),
      toActionArr: [],
    };
  }

  function isListView() {
    // There are visible 'rows'
    return (
      Array.from(document.querySelectorAll("[role=main] [role=row]")).filter(
        (node) => node.offsetParent
      ).length > 0
    );
  }

  function isMessageView() {
    // There is a visible 'listitem'
    return (
      Array.from(
        document.querySelectorAll("[role=main] [role=listitem]")
      ).filter((node) => node.offsetParent).length > 0
    );
  }

  function scrapeList() {
    let possibleListItems = Array.from(
      document.querySelectorAll("[role=main] [role=row]")
    ).filter((node) => node.offsetParent);

    let firstListItem = possibleListItems[0];

    let listLength = possibleListItems.length;

    let possibleNextBtns = true
      ? document.querySelectorAll('[data-tooltip="Older"]')
      : document.querySelectorAll('[data-tooltip="Newer"]');

    let nextBtn = Array.from(possibleNextBtns).filter(
      (node) => node.offsetParent
    )[0];

    return {
      length: listLength,
      firstItem: firstListItem,
    };
  }

  function scrapeMessage() {
    let possibleUnsubLinks = Array.from(
      document.querySelectorAll('[role="listitem"] a')
    ).filter((a) => /unsubscribe/i.test(a?.textContent));

    let unsubLink =
      possibleUnsubLinks.length > 0 ? possibleUnsubLinks[0] : false;

    let possibleUnsubBtn = document.querySelector("[idlink]");

    let unsubBtn =
      possibleUnsubBtn?.textContent?.toLowerCase() === "unsubscribe"
        ? possibleUnsubBtn
        : false;

    let possibleNextBtns = true
      ? document.querySelectorAll('[data-tooltip="Older"]')
      : document.querySelectorAll('[data-tooltip="Newer"]');

    let nextBtn = Array.from(possibleNextBtns).filter(
      (node) => node.offsetParent
    )[0];

    let sender = document.querySelectorAll("span .go")[0]?.textContent;

    let subject = document.querySelectorAll("[data-thread-perm-id]")[0]
      ?.textContent;

    let when = document.querySelectorAll('[alt*=":"][title*=":"]')[0]
      ?.textContent;

    let url = window.location.href;

    return {
      sender,
      subject,
      when,
      unsubLink: unsubLink.href,
      unsubBtn,
      nextBtn,
      url,
    };
  }

  function run(prevM) {
    if (isListView()) {
      let l = scrapeList();
      l.firstItem.click();
      setTimeout(() => {
        run();
      }, delay * 5);
    }

    let m = scrapeMessage();
    if (i >= n) return printResults(results, { i, n, m, msg: "i>=n" });
    if (m?.url === prevM?.url)
      return printResults(results, { i, n, m, msg: "same url" });

    results.scraped.push(m);

    if (m.unsubLink) {
      // m.unsubLink.click();
      // results.actioned.push(m);
      if (!results.toActionMap.has(m.unsubLink)) results.toActionArr.push(m);
      results.toActionMap.set(m, m.unsubLink);
    }

    if (m.nextBtn) {
      m.nextBtn.click();
      i++;
    }

    console.log("tick", { i, n, m, r: results.toActionArr });
    setTimeout(() => {
      run(m);
    }, delay);
  }

  function printResults(results, debug) {
    console.log(`Debug:`, debug);
    console.group(`${results.toActionArr.length} Results To Action:`);
    results.toActionArr?.map((r) =>
      console.log(
        `${r.when} - ${r.sender?.replace(/[\<\>]/g, "")} - ${r.subject}: ${
          r.unsubLink
        }`
      )
    );
    console.groupEnd();
  }

  (function start(nProvided) {
    reset();
    n =
      nProvided ||
      prompt(
        "How many emails to loop through? (This also " +
          "roughly equates to the number of browser " +
          "tabs this script will open)",
        25
      );
    n = parseInt(n, 10);
    if (!Number.isInteger(n))
      return alert("Number must be an integer greater than zero");
    run();
  })(nProvided);
}
