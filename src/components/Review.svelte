<script>
  import Dialog from "./Dialog.svelte";
  import { actionableResults, viewState } from "../stores";
  import { start, stop, cancel } from "../actions";

  let imgSrc = chrome.runtime.getURL("images/icon128.png");

  let displayedResults = [],
    selectedResults = [];

  $: displayedResults = groupResultsBySender($actionableResults).map((r) => {
    r.checked = true;
    return r;
  });

  $: selectedResults = displayedResults.filter((r) => r.checked);

  $: dynamicSubtitle = `Found ${displayedResults.length} ${
    displayedResults.length === 1 ? "email" : "emails"
  } with unsubscribe links. Click Unsubscribe to open links in new tabs and confirm any remaining unsubscribe steps.`;

  function handleLaunchUrls(urls) {
    // urls should be an array of url strings
    chrome.runtime.sendMessage({ message: "open_new_tabs", urls });
  }

  function handleReviewFinish() {
    const urls = selectedResults.map((r) => r[0].unsubLink);
    if (selectedResults.length > 0) {
      handleLaunchUrls(urls);
    }
    // cancel();
  }

  function groupResultsBySender(resultsArr) {
    const groupedObj = resultsArr.reduce((acc, item) => {
      const { sender, subject, when, unsubLink, url } = item;
      const key = sender && sender.replace(/[@\.]/g, "");
      if (!acc[key]) acc[key] = [];
      acc[key] = [...acc[key], { sender, subject, when, unsubLink, url }];
      return acc;
    }, {});

    return Object.values(groupedObj);
  }

  function handleCheckboxChange(i) {
    displayedResults = displayedResults.map((r, index) => {
      if (index === i) r.checked = !r.checked;
      return r;
    });
  }

  function handleCheckedAllChange(e) {
    const isChecked = e.target.checked;
    displayedResults = displayedResults.map((r, index) => {
      r.checked = isChecked;
      return r;
    });
  }

  const prettyTimestamp = (str = "") =>
    /\((.*)\)/.test(str) ? str.match(/\((.*)\)/)[1] : "";
</script>

<Dialog>
  <div class="overflow-y-auto">
    <table class="w-full my-4">
      <thead class="font-bold border-b border-gray-300">
        <tr>
          <td class="text-center">
            <input
              type="checkbox"
              checked={true}
              on:change={handleCheckedAllChange}
            />
          </td>
          <td />
          <td
            >Senders with Unsubscribe Links ({displayedResults.length || 0})</td
          >
        </tr>
      </thead>
      <tbody>
        {#if displayedResults.length === 0}
          <tr>
            <td colspan="5" class="text-center">No results to display</td>
          </tr>
        {/if}
        {#each displayedResults as emailsBySender, i}
          <tr class="align-top hover:bg-gray-200">
            <td class="text-center">
              <label for={`i-${i}`} class="px-2">
                <input
                  type="checkbox"
                  checked={emailsBySender.checked}
                  id={`i-${i}`}
                  name={`i-${i}`}
                  on:change={(e) => handleCheckboxChange(i)}
                />
              </label>
            </td>
            <td class="text-gray-400">{i + 1}.</td>
            <td>
              <label for={`i-${i}`} class="font-bold"
                >{emailsBySender[0].sender}</label
              >
              <!-- ({emailsBySender.length ||
                  0}) -->
              <br />
              <label for={`i-${i}`}>
                {#each emailsBySender as email}
                  &#128231; <a
                    href={email.url}
                    on:click|preventDefault={(e) =>
                      handleLaunchUrls([email.url])}
                  >
                    {email.subject}
                  </a>
                  {#if prettyTimestamp(email.when).length > 0}
                    ({prettyTimestamp(email.when)})
                  {/if}
                  <br />
                {/each}
              </label>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex justify-between items-center pt-4 border-t border-gray-300">
    {#if $viewState === "progress"}
      <button class="Btn Tertiary" on:click|capture|preventDefault={stop}
        >Cancel</button
      >
      <!-- {:else}
      <button class="Btn Tertiary" on:click|capture|preventDefault={start}
        >Resume</button
      > -->
    {/if}
    {#if $viewState === "review"}
      <button class="Btn Tertiary" on:click|capture|preventDefault={cancel}
        >Quit</button
      >
    {/if}

    <button
      on:click|preventDefault={handleReviewFinish}
      disabled={selectedResults.length < 1}
      class="Btn Primary"
    >
      Click {selectedResults.length} Unsubscribe Links
    </button>
  </div>
</Dialog>

<style>
  td {
    /* @apply whitespace-no-wrap p-1 overflow-x-hidden; */
    text-overflow: ellipsis;
    /* width: 100%; */
    padding: 0.5rem 0;
    /* max-width: min(20rem, 30vw); */
  }
  tbody:before {
    content: "\a0";
    display: block;
    padding: 0;
    margin: 0;
    line-height: 0;
    height: 0.25rem;
  }
</style>
