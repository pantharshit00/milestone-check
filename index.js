const status_context = "Milestone Check";
const failure_state = "pending";
const failure_description = "Please set the milestone!";
const failure_backlog_description = "Incorrect Milestone! Should be Release.";
const success_state = "success";
const success_description = "Great, the milestone is set.";
const skipped_description = "The milestone is not required. (skipped)";
const allowListGitHubUsernames = ["renovate", "renovate-bot"];

function createStatus(context, owner, repo, sha, state, desc) {
  return context.github.repos.createStatus({
    owner: owner,
    repo: repo,
    sha: sha,
    state: state,
    description: desc,
    context: status_context,
  });
}

module.exports = (app) => {
  app.on("pull_request", async (context) => {
    app.log.info("Received pull_request webhook");

    if (app.log.debug()) {
      app.log.debug(
        { hook: context.payload.pull_request },
        "Received webhook payload"
      );
    }

    const owner = context.payload.pull_request.base.repo.owner.login;
    const repo = context.payload.pull_request.base.repo.name;
    const sha = context.payload.pull_request.head.sha;
    const username = context.payload.pull_request.user.login;
    const milestone = context.payload.pull_request.milestone;

    if (milestone == null) {
      if (allowListGitHubUsernames.includes(username)) {
        app.log.info("username is skipped => passing the status check");
        return createStatus(
          context,
          owner,
          repo,
          sha,
          success_state,
          skipped_description
        );
      } else {
        app.log.info("No milestone set => failing the status check");
        return createStatus(
          context,
          owner,
          repo,
          sha,
          failure_state,
          failure_description
        );
      }
    } else if (milestone.title.startsWith("Backlog")) {
      app.log.info("Milestone is set to Backlog => failing the status check");
      return createStatus(
        context,
        owner,
        repo,
        sha,
        failure_state,
        failure_backlog_description
      );
    } else {
      app.log.info("Milestone is set => passing the status check");
      return createStatus(
        context,
        owner,
        repo,
        sha,
        success_state,
        success_description
      );
    }
  });

  app.on("issues", async (context) => {
    app.log.info("Received issue webhook");

    if (app.log.debug()) {
      app.log.debug(
        { hook: context.payload.pull_request },
        "Received webhook payload"
      );
    }

    // Get issue
    const issue = await context.github.issues.get({
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
      number: context.payload.issue.number,
    });

    if (issue.data.pull_request != null) {
      app.log.info("Issue is a PR");

      // It is a PR, so we need to get the PR
      const pr = await context.github.pulls.get({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        number: context.payload.issue.number,
      });

      const owner = pr.data.base.repo.owner.login;
      const repo = pr.data.base.repo.name;
      const sha = pr.data.head.sha;
      const username = pr.data.base.user.login;
      const milestone = pr.data.milestone;

      if (milestone == null) {
        if (allowListGitHubUsernames.includes(username)) {
          app.log.info("username is skipped => passing the status check");
          return createStatus(
            context,
            owner,
            repo,
            sha,
            success_state,
            skipped_description
          );
        } else {
          app.log.info("No milestone set => failing the status check");
          return createStatus(
            context,
            owner,
            repo,
            sha,
            failure_state,
            failure_description
          );
        }
      } else if (milestone.title.startsWith("Backlog")) {
        app.log.info("Milestone is set to Backlog => failing the status check");
        return createStatus(
          context,
          owner,
          repo,
          sha,
          failure_state,
          failure_backlog_description
        );
      } else {
        app.log.info("Milestone is set => passing the status check");
        return createStatus(
          context,
          owner,
          repo,
          sha,
          success_state,
          success_description
        );
      }
    } else {
      app.log.info("Issue is not a PR!");
      return;
    }
  });

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
