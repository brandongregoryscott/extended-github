import { sleep } from "@/utilities/core-utils";
import {
  assignSelfViaPopover,
  findAssignYourselfButton,
  getAuthenticatedUserName,
  getPullRequestAuthorUserName,
  isAuthenticatedUserAssigned,
  toggleAssigneesPopover,
} from "@/utilities/dom-utils";
import { isEnabled } from "@/utilities/settings";

const PULL_REQUEST_URL_PATTERN = "*://github.com/*/*/pull/*";
const watchPattern = new MatchPattern(PULL_REQUEST_URL_PATTERN);

async function maybeAssignSelfToPullRequest() {
  if (!(await isEnabled())) {
    return;
  }

  const authenticatedUser = getAuthenticatedUserName();
  const pullRequestAuthor = getPullRequestAuthorUserName();
  if (
    authenticatedUser == null ||
    pullRequestAuthor == null ||
    authenticatedUser !== pullRequestAuthor
  ) {
    return;
  }

  const isAssigned = isAuthenticatedUserAssigned();
  if (isAssigned) {
    return;
  }

  const assignYourselfButton = findAssignYourselfButton();
  if (assignYourselfButton != null) {
    assignYourselfButton.click();
    return;
  }

  toggleAssigneesPopover();
  await sleep(250);
  toggleAssigneesPopover();
  await sleep(250);
  toggleAssigneesPopover();
  await sleep(1000);
  assignSelfViaPopover();
  await sleep(500);
  toggleAssigneesPopover();
}

const contentScript = defineContentScript({
  matches: [PULL_REQUEST_URL_PATTERN],
  async main(ctx) {
    await maybeAssignSelfToPullRequest();

    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      if (watchPattern.includes(newUrl)) {
        await maybeAssignSelfToPullRequest();
      }
    });
  },
});

// eslint-disable-next-line collation/no-default-export -- This module needs to be default exported
export default contentScript;
