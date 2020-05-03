import { html, mount, unmount, setChildren } from "../lib/redom.es.min.js";

export default function handleResults(results, debugObj) {
  consoleDump(results, debugObj);
  renderDom(results, debugObj);
}

function renderDom(results, debug) {
  const resultsDetail = renderResultsDetail(results.actionable);
  mount(document.body, resultsContainer);
  setChildren(resultsContainer, [resultsHeader, resultsDetail, closeButton]);
  closeButton.addEventListener("click", (e) => {
    e.preventDefault();
    unmount(document.body, resultsContainer);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || evt.key === "Esc" || evt.keyCode === 27)
      unmount(document.body, resultsContainer);
  });
}

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

const resultsContainer = html("div.unsubmarine.results", {
  style: {
    color: "white",
    backgroundColor: "red",
    position: "absolute",
    zIndex: "999",
    top: "1rem",
    left: "1rem",
    right: "1rem",
    bottom: "0",
    padding: "4rem",
    alignItems: "center",
    justifyContent: "center",
    wordBreak: "break-all",
    flexDirection: "column",
    overflowY: "auto",
    borderRadius: "1rem 1rem 0 0",
  },
});
const closeButton = html("button", "Cancel");

const resultsHeader = html(
  "div",
  html("h1", "Hello from Unsubmarine."),
  html("p", "Here are the results:")
);

// const renderResultsDetail = (results) => {
//   const resultsDetail = html(
//     "code",
//     { style: { whiteSpace: "pre-wrap", padding: "2rem 0", display: "block" } },
//     JSON.stringify(results, null, 1)
//   );
//   return resultsDetail;
// };

const renderResultsDetail = (results) => {
  const uniqueResults = dedupe(results);
  const resultsDetail = html("ul", { style: { padding: "2rem 0" } });
  setChildren(
    resultsDetail,
    uniqueResults.map((result) => {
      return html(
        "li",
        html(
          "div",
          prettyEmail(result.sender),
          html("a", { href: result.url, target: "_blank" }, result.subject),
          prettyTimestamp(result.when)
          // html("a", { href: result.unsubLink, target: "_blank" }, "unsub")
        )
      );
    })
  );
  return resultsDetail;
};

const prettyEmail = (str) => str.replace(/[<>]/g, "");
const prettyTimestamp = (str) => str.match(/\((.*)\)/)[1] || str;

const dedupe = (results) => {
  const uniqMap = {};
  return results.filter((res) => {
    const key = res.unsubLink + res.when;
    if (uniqMap[key]) return false;
    uniqMap[key] = true;
    return true;
  });
};
