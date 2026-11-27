# ANA Blockchain Website

The public-facing website for **ANA Blockchain**. This repository is intentionally separate from the blockchain node and protocol source code.

## Website

- GitHub repository: https://github.com/Rajosreeranighosh/ANA-Website
- Expected GitHub Pages address: https://rajosreeranighosh.github.io/ANA-Website/
- Blockchain source: https://github.com/Rajosreeranighosh/ANA-Blockchain

The site is plain HTML, CSS, and JavaScript. There is no package installation or build framework.

## One-time GitHub Pages setup

The first deployment requires Pages to be enabled by a repository administrator:

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Save the setting, then open **Actions → Deploy ANA Website** and rerun the latest workflow (or push a site change).

The workflow intentionally does not try to create the Pages site using `GITHUB_TOKEN`: GitHub's Pages site-creation endpoint requires elevated administration permission that this workflow token does not have. Once Pages is enabled in Settings, the workflow can deploy with its scoped `pages: write` and `id-token: write` permissions.

## Validation

Run the built-in, dependency-free link and page checks locally with:

```sh
node scripts/check-site.mjs
```

The validation job runs before every deployment. It checks required pages, metadata, local links, in-page anchors, and the sitemap/robots files.

## Accuracy and safety

ANA is an experimental prototype, not a launched or audited production blockchain. The proposed 21,000,000 ANA supply is a design target; do not imply that consensus enforcement is complete, that tokens are circulating, or that the network is ready for real funds. Keep engineering status linked to the actual source repository and open pull requests.

TLS peer transport work is tracked in draft [PR #41](https://github.com/Rajosreeranighosh/ANA-Blockchain/pull/41); describe it as in development until it is merged, tested, and reviewed.
