<script>
  import Dialog from "./Dialog.svelte";
  import { waitForGmailPageChangeOnce } from "../lib/unsubmarine/observers";
  import { start, hideUI } from "../actions";
  let imgSrc = chrome.runtime.getURL("images/icon128.png");

  const handleStandardMode = (e) => {
    start();
  };

  const handleTestPilotMode = async (e) => {
    hideUI();
    await navigateToSearchPageAnimatedly();
    start();
  };

  async function navigateToSearchPageAnimatedly() {
    const searchInput = document.querySelector("[name=q]");
    const parent = searchInput.closest("form");
    const defaultColor = parent.style.backgroundColor;
    parent.style.backgroundColor = "tomato";
    parent.style.color = "white";
    await simulateTyping(searchInput, "unsubscribe");
    parent.style.backgroundColor = defaultColor;
    parent.style.color = "inherit";
    if (window.location.hash !== "#search/unsubscribe") {
      window.location.hash = "#search/unsubscribe";
      await waitForGmailPageChangeOnce();
    }
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
</script>

<Dialog title={false} subtitle={false}>
  <header class="pb-2 mx-auto text-center">
    <img
      alt="unsubmarine logo"
      src={imgSrc}
      width="64px"
      height="auto"
      class="mx-auto pb-2"
    />
    <h1 class="text-3xl font-bold">Unsubmarine</h1>
    <p>Automating unsubscribe in Gmail.</p>
  </header>

  <div class="mx-auto">
    <p class="py-4 text-center">
      No data is shared with any company or external server. Unsubmarine
      automates your browser clicking through emails and collects the
      unsubscribe links, so you can batch unsubscribe.
    </p>

    <!-- <div
      class="Btn Secondary p-4 mb-4"
      on:click|preventDefault={handleStandardMode}
    >
      <h3 class="text-lg font-semibold">Start Unsubmarine</h3>
      <p class="font-normal">
        Search currently visible message list for unsubscribe links.
      </p>
    </div> -->

    <div
      class="Btn Primary p-4 mb-4"
      on:click|preventDefault={handleTestPilotMode}
    >
      <h3 class="text-lg font-semibold">Start</h3>
    </div>

    <!-- <p class="pt-6 text-sm">
      Designed to be helpful with privacy and security in mind. Feature
      requests/bugs on
      <a href="https://github.com/smcllns/unsubmarine/issues">
        github issue tracker.
      </a>
      For any feedback/discussion, email me: oscollins@gmail.com or DM on twitter
      <a href="https://twitter.com/smcllns">@smcllns.</a>
      All code is
      <a href="https://github.com/smcllns/unsubmarine">open source.</a>
      Read more about why I made this
      <a href="//smcllns.com/unsubmarine?ref=svelte" target="_blank">
        in blog post.
      </a>
    </p> -->
  </div>
</Dialog>
