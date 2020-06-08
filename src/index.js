import App from "./components/App.svelte";

var app = new App({
  target: document.body,
});

export default app;

// Known bugs to cleanup:
// - Unsub Limit = 5, it stops at 4
// - Hitting Finish button, the background scraper continues through 2 more emails
// - Starting Custom Mode with disabled Next button hangs on Review, doesn't trigger dupe URL...
// - Hitting Cancel doesn't seem to cleanly kill (the review window popped up) --- should remove Cancel and just make Stop button and always review. Too hard to decide between Finish and Cancel.
