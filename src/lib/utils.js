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
  console.group(`${results.length} Results To Action:`);
  results?.map((r) =>
    console.log(
      `${r.when} - ${r.sender?.replace(/[\<\>]/g, "")} - ${r.subject}: ${
        r.unsubLink
      }`
    )
  );
  console.groupEnd();
}

function simulateTyping(input, string) {
  return new Promise((resolve, reject) => {
    string.split("").forEach((char, index) => {
      setTimeout(() => {
        input.value = string.slice(0, index + 1);
        if (index === string.length - 1) resolve();
      }, 200 * index + 100 * Math.random());
    });
  });
}

export { consoleDump, dedupe, prettyTimestamp, simulateTyping };
