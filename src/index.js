import App from "./components/App.svelte";

var app = new App({
  target: document.body,
});

export default app;

// Known bugs to cleanup:
// - Hitting Finish button, the background scraper continues through 2 more emails
// - Hitting Cancel doesn't seem to cleanly kill (the review window popped up) --- should remove Cancel and just make Stop button and always review. Too hard to decide between Finish and Cancel.
