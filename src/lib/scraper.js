function isListView() {
  // There are visible 'rows'
  return (
    Array.from(document.querySelectorAll("[role=main] [role=row]")).filter(
      (node) => node.offsetParent,
    ).length > 0
  );
}

function isMessageView() {
  // There is a visible 'listitem'
  return (
    Array.from(document.querySelectorAll("[role=main] [role=listitem]")).filter(
      (node) => node.offsetParent,
    ).length > 0
  );
}

function scrapeListMeta() {
  // There is a visible 'listitem'

  let possibleListItems = Array.from(
    document.querySelectorAll("[role=main] [role=row]"),
  ).filter((node) => node.offsetParent);

  let firstItem = possibleListItems[0];

  let listLength = possibleListItems.length;

  let possibleNextBtns = true
    ? document.querySelectorAll('[data-tooltip="Older"]')
    : document.querySelectorAll('[data-tooltip="Newer"]');

  let nextBtn = Array.from(possibleNextBtns).filter(
    (node) => node.offsetParent,
  )[0];
  // On narrow viewport width, gmail can hide these buttons, in that case, choose the one furthest down the page (likely highest on UI layers?)
  if (!nextBtn && possibleNextBtns.length > 0)
    nextBtn = possibleNextBtns[possibleNextBtns.length - 1];

  return {
    firstItem,
    listLength,
    nextBtn,
  };
}

function scrapeMessageMeta() {
  let possibleUnsubLinks = Array.from(document.querySelectorAll("a")).filter(
    (a) => /unsubscribe/i.test(a.textContent) || /unsubscribe/i.test(a.href),
  );
  let possibleUnsubBtn = document.querySelector("[idlink]");
  let possibleNextBtns = true
    ? document.querySelectorAll('[data-tooltip="Older"]')
    : document.querySelectorAll('[data-tooltip="Newer"]');

  let unsubLink = possibleUnsubLinks.length > 0 ? possibleUnsubLinks[0] : false;
  let unsubBtn =
    possibleUnsubBtn?.textContent?.toLowerCase() === "unsubscribe"
      ? possibleUnsubBtn
      : false;
  let nextBtn = Array.from(possibleNextBtns).filter(
    (node) => node.offsetParent,
  )[0];
  // On narrow viewport width, gmail can hide these buttons, in that case, choose the one furthest down the page (likely highest on UI layers?)
  if (!nextBtn && possibleNextBtns.length > 0)
    nextBtn = possibleNextBtns[possibleNextBtns.length - 1];

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

export { isListView, isMessageView, scrapeListMeta, scrapeMessageMeta };
