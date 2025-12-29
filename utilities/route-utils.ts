type PullRequestPath = {
    organization: string;
    pullRequestNumber: number;
    repo: string;
};

class RouteUtils {
    static parsePullRequestPath(pathname: string): PullRequestPath {
        const [_empty, organization, repo, _pull, pullRequestNumberAsString] =
            pathname.split("/");
        return {
            organization,
            pullRequestNumber: parseInt(pullRequestNumberAsString),
            repo,
        };
    }
}

export { RouteUtils };
