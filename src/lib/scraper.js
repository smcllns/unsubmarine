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
    Array.from(document.querySelectorAll("[role=main] [role=listitem]")).filter(
      (node) => node.offsetParent
    ).length > 0
  );
}

function scrapeListMeta() {
  // There is a visible 'listitem'

  const possibleListItems = Array.from(
    document.querySelectorAll("[role=main] [role=row]")
  ).filter((node) => node.offsetParent);

  const firstItem = possibleListItems[0];

  const listLength = possibleListItems.length;

  const possibleNextBtns = true
    ? document.querySelectorAll('[data-tooltip="Older"]')
    : document.querySelectorAll('[data-tooltip="Newer"]');

  const nextBtn = Array.from(possibleNextBtns).filter(
    (node) => node.offsetParent
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

function scrapeWindowMeta() {
  const possibleNextBtns = true
    ? document.querySelectorAll('[data-tooltip="Older"]')
    : document.querySelectorAll('[data-tooltip="Newer"]');

  const nextBtn = Array.from(possibleNextBtns).filter(
    (node) => node.offsetParent
  )[0];

  // On narrow viewport width, gmail can hide these buttons, in that case, choose the one furthest down the page (likely highest on UI layers?)
  if (!nextBtn && possibleNextBtns.length > 0)
    nextBtn = possibleNextBtns[possibleNextBtns.length - 1];

  return { nextBtn };
}

function scrapeMessageMeta() {
  const { nextBtn } = scrapeWindowMeta();
  const msgEl = document.querySelector("[role=main]");

  const possibleUnsubLinks = Array.from(msgEl.querySelectorAll("a")).filter(
    (a) => /unsubscribe/i.test(a.textContent) || /unsubscribe/i.test(a.href)
  );
  const unsubLink =
    possibleUnsubLinks.length > 0 ? possibleUnsubLinks[0] : false;

  const possibleUnsubBtn = msgEl.querySelector("[idlink]");
  const unsubBtn =
    possibleUnsubBtn?.textContent?.toLowerCase() === "unsubscribe"
      ? possibleUnsubBtn
      : false;

  const sender = msgEl
    .querySelectorAll("span .go")[0]
    ?.textContent?.replace(/[<>]/g, "");
  const subject = msgEl.querySelectorAll("[data-thread-perm-id]")[0]
    ?.textContent;
  const when = msgEl.querySelectorAll('[alt*=":"][title*=":"]')[0]?.textContent;
  const msgUrl = window.location.href;

  console.log("from scraper url, subject, sender, ", msgUrl, subject, sender);

  return {
    sender,
    subject,
    when,
    unsubLink: unsubLink.href,
    unsubBtn,
    nextBtn,
    url: msgUrl,
  };
}

export { isListView, isMessageView, scrapeListMeta, scrapeMessageMeta };
