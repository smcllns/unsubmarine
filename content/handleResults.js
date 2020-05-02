export default function handleResults(results, debugObj) {
  consoleLogResults(results, debugObj);
}

function consoleLogResults(results, debug) {
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
