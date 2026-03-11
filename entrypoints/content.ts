import { PullRequests } from "@/features/pull-requests";
import { Logger } from "@/utilities/logger";
import { RouteUtils } from "@/utilities/route-utils";

const contentScript = defineContentScript({
    async main(ctx) {
        await Logger.refresh();
        await PullRequests.runScripts();
        ctx.addEventListener(
            window,
            "wxt:locationchange",
            async ({ newUrl }) => {
                if (
                    RouteUtils.matchesExistingPullRequestUrl(newUrl) ||
                    RouteUtils.matchesNewPullRequestUrl(newUrl)
                ) {
                    await Logger.refresh();
                    await PullRequests.runScripts();
                }
            }
        );
    },
    matches: [
        RouteUtils.EXISTING_PULL_REQUEST_URL_PATTERN,
        RouteUtils.NEW_PULL_REQUEST_URL_PATTERN,
    ],
});

// eslint-disable-next-line collation/no-default-export -- This module needs to be default exported
export default contentScript;
