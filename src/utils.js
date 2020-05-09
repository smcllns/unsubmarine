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
      }`,
    ),
  );
  console.groupEnd();
}

export { consoleDump, dedupe, prettyEmail, prettyTimestamp };
