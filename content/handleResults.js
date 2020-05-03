import { el, mount } from "../lib/redom.es.min.js";

export default function handleResults(results, debugObj) {
  consoleDump(results, debugObj);
  renderDom(results, debugObj);
}

function renderDom(results, debug) {
  const hello = el(
    "div#test",
    {
      style: {
        color: "white",
        backgroundColor: "red",
        position: "absolute",
        zIndex: "999",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        padding: "4rem",
        alignItems: "center",
        justifyContent: "center",
        wordBreak: "break-all",
        flexDirection: "column",
        overflowY: "auto",
      },
    },
    el("h1", "Hello from Unsubmarine."),
    el("p", "Here are the results:"),
    el(
      "code",
      { style: { whiteSpace: "pre-wrap" } },
      JSON.stringify(results, null, 1)
    )
  );
  mount(document.body, hello);
}

function consoleDump(results, debug) {
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
  return {
    status: "done!",
    results,
  };
}
