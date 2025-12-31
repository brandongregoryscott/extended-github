type PullRequestPath = {
    organization: string;
    pullRequestNumber: number;
    repo: string;
};

class RouteUtils {
    static readonly EXISTING_PULL_REQUEST_URL_PATTERN =
        "*://github.com/*/*/pull/*";
    // Note: These patterns do NOT match on query strings, so that check needs to be performed manually.
    static readonly NEW_PULL_REQUEST_URL_PATTERN =
        "*://github.com/*/*/compare/*...*";
    static readonly EXISTING_PULL_REQUEST_MATCH_PATTERN = new MatchPattern(
        this.EXISTING_PULL_REQUEST_URL_PATTERN
    );
    static readonly NEW_PULL_REQUEST_MATCH_PATTERN = new MatchPattern(
        this.NEW_PULL_REQUEST_URL_PATTERN
    );

    static parsePullRequestPath(pathname: string): PullRequestPath {
        const [_empty, organization, repo, _pull, pullRequestNumberAsString] =
            pathname.split("/");
        return {
            organization,
            pullRequestNumber: parseInt(pullRequestNumberAsString),
            repo,
        };
    }

    static matchesNewPullRequestUrl(
        url: string | URL = window.location.href
    ): boolean {
        const searchParams = new URLSearchParams(window.location.search);
        return (
            this.NEW_PULL_REQUEST_MATCH_PATTERN.includes(url) &&
            searchParams.get("expand") === "1"
        );
    }

    static matchesExistingPullRequestUrl(
        url: string | URL = window.location.href
    ): boolean {
        return this.EXISTING_PULL_REQUEST_MATCH_PATTERN.includes(url);
    }
}

export { RouteUtils };
