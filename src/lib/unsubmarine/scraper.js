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

  return {
    firstItem: possibleListItems[0],
  };
}

function scrapeWindowMeta() {
  const possibleNextBtns = true
    ? document.querySelectorAll(
        '[data-tooltip="Older"]:not([aria-disabled="true"])'
      )
    : document.querySelectorAll(
        '[data-tooltip="Newer"]:not([aria-disabled="true"])'
      );
  // Making a note of selectors; may want to go forward and backwards sometime

  let nextBtn = Array.from(possibleNextBtns).filter(
    // offsetParent === null when element is hidden by display:none
    // On narrow viewport width, gmail can hide these buttons, in that case, they are not hidden by display none, so this continues to select the right one
    (node) => node.offsetParent
  );

  return { nextBtn: nextBtn[0] };
}

function scrapeMessageMeta() {
  // Needs cleaning up
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
