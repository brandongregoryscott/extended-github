import { PullRequests } from "@/features/pull-requests";

const PULL_REQUEST_URL_PATTERN = "*://github.com/*/*/pull/*";
const PULL_REQUEST_MATCH_PATTERN = new MatchPattern(PULL_REQUEST_URL_PATTERN);

const contentScript = defineContentScript({
    async main(ctx) {
        await PullRequests.autoAssignAuthor();

        ctx.addEventListener(
            window,
            "wxt:locationchange",
            async ({ newUrl }) => {
                if (PULL_REQUEST_MATCH_PATTERN.includes(newUrl)) {
                    await PullRequests.autoAssignAuthor();
                }
            }
        );
    },
    matches: [PULL_REQUEST_URL_PATTERN],
});

// eslint-disable-next-line collation/no-default-export -- This module needs to be default exported
export default contentScript;
