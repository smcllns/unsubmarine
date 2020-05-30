<script>
  import Dialog from "./Dialog.svelte";
  import { prettyTimestamp } from "../lib/utils";
  export let actionableResults, moveToNextView;

  function handleLaunchUrl(url) {
    chrome.runtime.sendMessage({ message: "open_new_tab", url });
  }

  function handleReviewFinish() {
    actionableResults.length > 0
      ? chrome.runtime.sendMessage({
          message: "open_new_tabs",
          urls: selectedResults.map(r => r[0].unsubLink)
        })
      : console.log("no actionable results to open");
    moveToNextView(true);
  }

  const resultsBySender = actionableResults.reduce((acc, item) => {
    const { sender, subject, when, unsubLink, url } = item.m;
    const key = sender.replace(/[@\.]/g, "");
    if (!acc[key]) acc[key] = [];
    acc[key] = [...acc[key], { sender, subject, when, unsubLink, url }];
    return acc;
  }, {});

  let confirmedResults = Object.values(resultsBySender).map(r => {
    r.checked = true;
    return r;
  });

  function handleCheckboxChange(i) {
    confirmedResults = confirmedResults.map((r, index) => {
      if (index === i) {
        r.checked = !r.checked;
      }
      return r;
    });
    console.log("Handled Checkbox Change");
  }

  $: selectedResults = confirmedResults.filter(r => r.checked);

  console.log("resultsBySender", resultsBySender);
</script>

<Dialog {moveToNextView}>
  <header class="pb-8 px-8 text-center">
    <h1 class="text-3xl font-bold">Confirm Unsubscribes</h1>
    <p>Select which emails to unsubscribe from</p>
  </header>

  <table>
    <thead>
      <tr>
        <td />
        <td>From</td>
        <td>Messages</td>
      </tr>
    </thead>
    <tbody>
      {#each confirmedResults as emailsBySender, i}
        <tr>
          <td>
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
            <label for={`i-${i}`}>
              {emailsBySender[0].sender} ({emailsBySender.length})
            </label>
          </td>
          <td class="Results__SubjectCell">
            <label for={`i-${i}`}>
              {#each emailsBySender as email}
                {prettyTimestamp(email.when)}:
                <a
                  href={email.url}
                  on:click|preventDefault={e => handleLaunchUrl(email.url)}>
                  {email.subject}
                </a>
                <br />
              {/each}
            </label>
          </td>
          <td />
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="flex justify-between items center pt-8">
    <button
      on:click|preventDefault={e => moveToNextView(true)}
      class="Btn Tertiary">
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
  thead {
    font-weight: bold;
  }
  td {
    padding: 0.25rem;
    white-space: nowrap;
  }
  tbody tr:hover {
    @apply bg-gray-200;
  }
  .Results__SubjectCell {
    max-width: 20rem;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
</style>
