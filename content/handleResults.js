import { html, mount, unmount, setChildren } from "../lib/redom.es.min.js";

export default function handleResults(results, debugObj, resolve) {
  consoleDump(results, debugObj);
  renderDom(results, debugObj, resolve);
}

function renderDom(results, debug, resolve) {
  mount(document.body, resultsContainer);
  const okBtn = okButton(results);
  const btns = html(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255,255,255,0.2)",
        padding: "1rem",
      },
    },
    closeButton,
    okBtn
  );
  setChildren(resultsContainer, [
    resultsHeader(results),
    resultsTable(results),
    btns,
    // closeButton,
    // okBtn,
    cssStyles,
  ]);
  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    unmount(document.body, resultsContainer);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || evt.key === "Esc" || evt.keyCode === 27)
      unmount(document.body, resultsContainer);
  });
  okBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const links = Array.from(
      document.querySelectorAll('.unsubmarine input[type="checkbox"]')
    )
      .filter((node) => node.checked)
      .map((node) => node.dataset.unsublink);
    resolve(links);
  });
}

const resultsContainer = html("div.unsubmarine.results", {
  style: {
    position: "absolute",
    zIndex: "999",
    top: "1rem",
    left: "1rem",
    right: "1rem",
    bottom: "0",
    padding: "4rem",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    overflowY: "auto",
    borderRadius: "1rem 1rem 0 0",
  },
});
const closeButton = html("button.mx-05", "Cancel");
const okButton = (results) => {
  return html(
    "button.mx-05",
    `Click `,
    html("span.live.selectedCount", results.actionable.length),
    ` unsubscribe links`
  );
};

const updateSelectedCount = () => {
  const count = Array.from(
    document.querySelectorAll('.unsubmarine input[type="checkbox"]')
  ).filter((node) => node.checked).length;

  Array.from(
    document.querySelectorAll(".unsubmarine .live.selectedCount")
  ).forEach((node) => (node.innerHTML = count));

  console.log("update selected", count);
};

const resultsHeader = (results) => {
  return html(
    "div",
    html("h1", "Hello from Unsubmarine."),
    html(
      "p",
      `Looped ${results.scraped.length} emails; found ${results.actionable.length} emails with unsubscribe links.`
    ),
    html(
      "p",
      `Please select which emails you wish to unsubscribe from - and Unsubmarine will click on each unsubscribe link for you. Note: This will just take the email unsubscribe action provided in the email. You need to complete further steps with the sender to finalize their unsubscription, and Unsubmarine isn't clever enough to do that right now. Please review each tab that is opened to confirm you have been successfully unsubscribed.`
    )
  );
};

const resultsTable = (results) => {
  const uniqueResults = dedupe(results.actionable);
  const table = html("table", { style: { padding: "2rem 0", width: "100%" } });
  const thead = html(
    "thead.text-bold",
    html(
      "tr",
      html("td.whitespace-pre", "Sender"),
      html("td", "Subject"),
      html("td.whitespace-pre", "When"),
      html("td.text-center.whitespace-pre", "Unsubscribe?")
    )
  );
  const tbody = html("tbody");
  setChildren(table, [thead, tbody]);
  setChildren(
    tbody,
    uniqueResults.map((result) => {
      const checkbox = html("input", {
        type: "checkbox",
        checked: true,
        dataset: {
          unsublink: result.unsubLink,
        },
      });
      checkbox.addEventListener("click", updateSelectedCount);
      return html(
        "tr",
        html("td.whitespace-pre", prettyEmail(result.sender)),
        html(
          "td",
          html("a", { href: result.url, target: "_blank" }, result.subject)
        ),
        html("td.whitespace-pre", prettyTimestamp(result.when)),
        html("td.text-center", checkbox)
      );
    })
  );

  return table;
};

const prettyEmail = (str = "") => str.replace(/[<>]/g, "");
const prettyTimestamp = (str = "") =>
  /\((.*)\)/.test(str) ? str.match(/\((.*)\)/)[1] : "";

const dedupe = (results) => {
  const uniqMap = {};
  return results.filter((res) => {
    const key = res.unsubLink + res.when;
    if (uniqMap[key]) return false;
    uniqMap[key] = true;
    return true;
  });
};

function consoleDump(results, debug) {
  console.log(`Debug:`, debug, results);
  console.group(`${results.actionable.length} Results To Action:`);
  results.actionable?.map((r) =>
    console.log(
      `${r.when} - ${r.sender?.replace(/[\<\>]/g, "")} - ${r.subject}: ${
        r.unsubLink
      }`
    )
  );
  console.groupEnd();
}

const cssStyles = html(
  "style",
  `
.unsubmarine {
  background: rgb(219,68,55);
  color: rgba(255,255,255,0.9);
}
.unsubmarine a {
  color: rgba(255,255,255,0.9);
  text-decoration: none;
}
.unsubmarine thead td {
  padding-bottom: 1rem;
}
.unsubmarine tbody tr {
  background: rgba(255,255,255,0.1);
}
.unsubmarine td {
  padding: 1rem;
  position: relative;
}

.unsubmarine .text-center {
  text-align: center;
}
.unsubmarine .text-bold {
  font-weight: bold; 
}
.unsubmarine .pb-1 {
  padding-bottom: 1rem;
}
.unsubmarine .whitespace-pre {
  white-space: pre;
}
.unsubmarine .mx-05 {
  margin: 0 0.5rem 0 0.5rem;
}
`
);
