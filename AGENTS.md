# Academic Website Repository Instructions

- Treat the CV repository's `evidence/claims.yml` and `evidence/surfaces.yml` as the factual source of truth.
- Inspect `git status` before editing and preserve unrelated user work.
- Every factual content entry must retain valid `claimIds` allowed on its public surface.
- Keep project names, personal roles, dates, metrics, award wording, and public links consistent with the canonical CV.
- Never publish a phone number, student ID, certificate identifier, local filesystem path, private repository URL, or omitted claim.
- Preserve the Astro content-collection architecture, the continuously scrollable homepage, and optional detail routes.
- Synchronize the public Academic Research CV with `npm run sync:cv -- --source <canonical-pdf>`.
- Run `npm run qa` after every website content, code, or downloadable-CV change.
- Show factual diffs and QA results before requesting permission to commit.
- Obtain a separate explicit instruction before any push or deployment.
- Do not run destructive Git commands or delete user files.
