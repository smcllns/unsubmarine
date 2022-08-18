<script>
  import Dialog from "./Dialog.svelte";
  import { waitForGmailPageChangeOnce } from "../lib/unsubmarine/observers";
  import { start, hideUI } from "../actions";

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

<Dialog>
  <div class="mx-auto">
    <p class="py-4 text-center">
      Unsubmarine automates the process of clicking through emails to find
      unsubscribe links, and presents them in one list so you can choose what to
      bulk unsubscribe from.
    </p>
    <div
      class="Btn Primary p-4 mb-4"
      on:click|preventDefault={handleTestPilotMode}
    >
      <h3 class="text-lg font-semibold">Start Search</h3>
    </div>

    <p class="pb-4 text-sm">
      Unsubmarine is an open source client-only browser extension so your data
      doesn't leave your browser, and it has no persistent storage so it doesn't
      remember anything after a page refresh. It does nothing until you click
      Start. <a href="https://github.com/smcllns/unsubmarine">Code on github</a
      >.
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
