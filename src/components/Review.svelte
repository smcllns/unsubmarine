<script>
  import Dialog from "./Dialog.svelte";
  import { actionableResults } from "./stores";
  import { cancel } from "./navigation";
  import { prettyTimestamp } from "../lib/utils";

  const resultsGroupedBySender = $actionableResults.reduce((acc, item) => {
    const { sender, subject, when, unsubLink, url } = item;
    const key = sender && sender.replace(/[@\.]/g, "");
    if (!acc[key]) acc[key] = [];
    acc[key] = [...acc[key], { sender, subject, when, unsubLink, url }];
    return acc;
  }, {});

  let displayedResults = Object.values(resultsGroupedBySender).map(r => {
    r.checked = true;
    return r;
  });

  $: selectedResults = displayedResults.filter(r => r.checked);

  function handleLaunchUrl(url) {
    chrome.runtime.sendMessage({ message: "open_new_tab", url });
  }

  function handleReviewFinish() {
    selectedResults.length > 0
      ? chrome.runtime.sendMessage({
          message: "open_new_tabs",
          urls: selectedResults.map(r => r[0].unsubLink)
        })
      : console.log("no actionable results to open");
    cancel();
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
</script>

<Dialog
  title="Confirm Unsubscribes"
  subtitle="Select which emails to unsubscribe from">

  <table>
    <thead class="font-bold">
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
                  on:click|preventDefault={e => handleLaunchUrl(email.url)}>
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
</style>
