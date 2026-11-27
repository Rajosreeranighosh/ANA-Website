# ANA Blockchain Website

The public-facing website for **ANA Blockchain**. This repository is intentionally separate from the blockchain node and protocol source code.

## Website

- GitHub repository: https://github.com/Rajosreeranighosh/ANA-Website
- Expected GitHub Pages address: https://rajosreeranighosh.github.io/ANA-Website/
- Blockchain source: https://github.com/Rajosreeranighosh/ANA-Blockchain

The Pages workflow in `.github/workflows/pages.yml` deploys the static site when files other than this README change on `main`, or when manually dispatched. The site is plain HTML, CSS, and JavaScript; no build step or package installation is required.

## Accuracy and safety

ANA is an experimental prototype, not a launched or audited production blockchain. The proposed 21,000,000 ANA supply is a design target; do not imply that consensus enforcement is complete, that tokens are circulating, or that the network is ready for real funds. Keep engineering status linked to the actual source repository and open pull requests.

TLS peer transport work is tracked in draft [PR #41](https://github.com/Rajosreeranighosh/ANA-Blockchain/pull/41); describe it as in development until it is merged, tested, and reviewed.
