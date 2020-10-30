# Milestone Check

Github application which verifies whether a milestone has been set on a PR or not.
The result is used as a status on the PR / last commit in the PR.
If your projects wants all PRs to have a milestone set, this GitHub application will make it easier to track whether they have it or not.

## Development

Milestone Check is built with [Probot](https://github.com/probot/probot) framework.

### Setup

```sh
# Install dependencies
npm install

# Run locally for development
npm run dev
```

## Deployment

- GitHub App Owned by: @Jolg42 - App ID: 86774 - https://github.com/settings/apps/milestone-check
- Deployed on Heroku `probot-apps-github`

## Fork extra features

- Renovate bot is ignored so automerge can happen when all tests are passing
- Milestone check will fail if the name of the milestone starts with "Backlog"

## Contributing

If you have suggestions for how Milestone Check could be improved, or want to report a bug, open an issue!
We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Jakub Scholz <github@scholzj.com>
