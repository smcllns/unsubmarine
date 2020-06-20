<script>
  import Dialog from "./Dialog.svelte";
  import { actionableResults } from "../stores";
  import { cancel } from "../actions";
  let displayedResults, selectedResults;

  $: displayedResults = groupResultsBySender($actionableResults).map(r => {
    r.checked = true;
    return r;
  });

  $: selectedResults = displayedResults.filter(r => r.checked);

  function handleLaunchUrls(urls) {
    // urls should be an array of url strings
    chrome.runtime.sendMessage({ message: "open_new_tabs", urls });
  }

  function handleReviewFinish() {
    if (selectedResults.length > 1) {
      const urls = selectedResults.map(r => r[0].unsubLink);
      handleLaunchUrls(urls);
    }
    cancel();
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

<Dialog
  title="Confirm Unsubscribes"
  subtitle="Select which emails to unsubscribe from">

  <table>
    <thead class="font-bold border-b border-gray-300">
      <tr>
        <td class="text-center">
          <input
            type="checkbox"
            checked={true}
            on:change={handleCheckedAllChange} />
        </td>
        <td>From</td>
        <td>#</td>
        <td>Messages</td>
        <td>When</td>
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
                on:change={e => handleCheckboxChange(i)} />
            </label>
          </td>
          <td>
            <label for={`i-${i}`}>{emailsBySender[0].sender}</label>
          </td>
          <td>{emailsBySender.length}</td>
          <td>
            <label for={`i-${i}`}>
              {#each emailsBySender as email}
                <a
                  href={email.url}
                  on:click|preventDefault={e => handleLaunchUrls([email.url])}>
                  {email.subject}
                </a>
                <br />
              {/each}
            </label>
          </td>
          <td>
            {#each emailsBySender as email}
              {prettyTimestamp(email.when)}
              <br />
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="flex justify-between items center pt-8">
    <button on:click|preventDefault={cancel} class="Btn Tertiary">
      Cancel
    </button>
    <button
      on:click|preventDefault={handleReviewFinish}
      disabled={selectedResults.length < 1}
      class="Btn Primary">
      Unsubscribe ({selectedResults.length})
    </button>
  </div>

</Dialog>

<style>
  td {
    @apply whitespace-no-wrap p-1 overflow-x-hidden;
    text-overflow: ellipsis;
    max-width: min(20rem, 30vw);
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
