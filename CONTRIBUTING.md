# Contributing to Blockparty Modal

Thank you for your interest in this project. This document describes how we work with branches, pull requests, and releases.

## Branch model (everyone)

- **`develop`** is the main integration branch for day-to-day work. New work should land here first.
- **`main`** tracks the production-ready state (for example, what is released to WordPress.org and tagged versions).

## Contributing with a fork (typical for external contributors)

If you do **not** have push access to the upstream repository, use a fork:

1. **Fork** this repository on GitHub to your own account.
2. **Clone your fork** and add the upstream remote (read-only):

   ```sh
   git remote add upstream https://github.com/BeAPI/blockparty-modal.git
   ```

3. **Update `develop` from upstream** before you start a branch:

   ```sh
   git fetch upstream
   git checkout develop
   git pull upstream develop
   ```

4. **Create a branch** from the latest `develop` (e.g. `feat/short-desc`, `fix/short-desc`).
5. **Push the branch to your fork** and **open a Pull Request** on GitHub from your fork to the **`develop`** branch of the upstream repository — not to `main`.
6. **Review** — when the maintainers have reviewed and approved the PR, they will merge it into `develop`.
7. **CI** must pass. Follow existing code style; update translations or assets when your change requires it.

You can use the same `git pull upstream develop` flow to keep your fork’s `develop` in sync with upstream over time.

## Day-to-day contributions (if you have push access to the repository)

1. **Branch from `develop`** on the same repository.
2. **Open a Pull Request toward `develop`**.
3. After the PR is approved, it is merged into `develop`.
4. **CI** must be green, same as above.

## Release process (repository owners and maintainers only)

The following applies **only to people with permission to cut releases and publish** (e.g. repository owners, maintainers with tag/publish access). **External contributors do not cut releases;** your changes reach users after maintainers prepare a release from the steps below.

1. **Create a version branch** from `develop`, named with the [Semantic Versioning](https://semver.org/) value you are about to release:
   - Pattern: `ver/X.X.X` (e.g. `ver/1.0.8`).

2. **Bump the version everywhere** so every file stays in sync, including (non-exhaustive):
   - [`.plugin-data`](.plugin-data) (source of truth for the automation in this repository)
   - `package.json` and `package-lock.json`
   - `src/**/block.json` (and any other block `block.json` files)
   - `blockparty-modal.php` (header and `BLOCKPARTY_MODAL_VERSION`)
   - `readme.txt` (Stable tag and `== Changelog ==` entry)
   - `CHANGELOG.md`
   - [`.wordpress-org/blueprints/blueprint.json`](.wordpress-org/blueprints/blueprint.json) (`pluginData.ref` for the Playground install step)

   The script [`tests/bin/check-release-version.sh`](tests/bin/check-release-version.sh) and the [pull request workflow for versions](.github/workflows/pull-request-version.yml) help verify that, when the version in `.plugin-data` changes, the new tag is not already taken and the listed files are updated consistently. From the repository root, you can run: `./tests/bin/check-release-version.sh`

3. **Open Pull Requests** from `ver/X.X.X` to **`develop`** and to **`main`** (or the flow your team uses to promote and ship). Both should carry the same version bump so `develop` and `main` stay aligned.

4. **Tag and publish** after the version is merged to `main` (Git tag, WordPress.org build, etc.).

## Questions

If something is unclear, open an issue or ask in a pull request. Maintainers can adjust this process as the project evolves.
