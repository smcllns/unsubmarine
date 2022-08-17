<script>
  import { actionableResults, processedEmailCount } from "../stores";
  import { stop } from "../actions";
  let displayedResults = [];

  $: displayedResults = groupResultsBySender($actionableResults).map((r) => {
    r.checked = true;
    return r;
  });

  function handleLaunchUrls(urls) {
    // urls should be an array of url strings
    chrome.runtime.sendMessage({ message: "open_new_tabs", urls });
  }

  const prettyTimestamp = (str = "") =>
    /\((.*)\)/.test(str) ? str.match(/\((.*)\)/)[1] : "";

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
</script>

<div class="flex flex-1 flex-col-reverse pointer-events-none">
  <div
    class=" py-4 px-6 mx-8 rounded-t-lg
    bg-black text-white self-end max-w-md	"
  >
    <div class="flex justify-between items-center pointer-events-auto ">
      <div class="text-sm">
        <p class="font-bold font-tomato pr-2">
          Looking for unsubscribe links...
        </p>
        <!-- <p>
          Clicked through {$processedEmailCount} emails; collected {$actionableResults.length}
          unsubscribe links
        </p> -->
      </div>
      <span class="Btn Primary" on:click|preventDefault={stop}>Finish</span>
    </div>
    <table class="w-full mt-4">
      <thead class="font-bold border-b border-gray-300">
        <tr>
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
            <td>
              <label for={`i-${i}`}>{emailsBySender[0].sender}</label>
            </td>
            <td>{emailsBySender.length}</td>
            <td>
              <label for={`i-${i}`}>
                {#each emailsBySender as email}
                  <a
                    href={email.url}
                    on:click|preventDefault={(e) =>
                      handleLaunchUrls([email.url])}
                  >
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
  </div>
</div>
