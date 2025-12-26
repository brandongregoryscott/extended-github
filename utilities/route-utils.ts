type PullRequestPath = {
  organization: string;
  repo: string;
  pullRequestNumber: number;
};

function parsePullRequestPath(pathname: string): PullRequestPath {
  const [_empty, organization, repo, _pull, pullRequestNumberAsString] =
    pathname.split("/");
  return {
    organization,
    repo,
    pullRequestNumber: parseInt(pullRequestNumberAsString),
  };
}

export { parsePullRequestPath };
